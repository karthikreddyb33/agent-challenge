import os
import json
import aiohttp
import logging
from typing import Any, Dict, List, Optional, TypedDict, Union
from dataclasses import dataclass
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
HELIUS_API_URL = "https://mainnet.helius-rpc.com"
DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com"
REQUEST_TIMEOUT = 30  # seconds

# Helius API Key
HELIUS_API_KEY = "c5ff6d8a-44c0-4a0b-8e81-3cd87e03bd41"
SOLANA_RPC_URL = os.getenv("SOLANA_RPC_URL", DEFAULT_RPC_URL)

# Helius API Endpoints
HELIUS_TOKEN_BALANCE_ENDPOINT = f"{HELIUS_API_URL}/?api-key={HELIUS_API_KEY}"

# Custom exceptions
class SolanaDataFetcherError(Exception):
    """Base exception for Solana data fetcher errors."""
    pass

class APIError(SolanaDataFetcherError):
    """Raised when there's an error with the Solscan API."""
    pass

class ValidationError(SolanaDataFetcherError):
    """Raised when input validation fails."""
    pass

# Type definitions
class TokenInfo(TypedDict, total=False):
    """Structure for token information."""
    mint: str
    owner: str
    amount: int
    decimals: int
    ui_amount: float

class TransactionInfo(TypedDict, total=False):
    """Structure for transaction information."""
    signature: str
    timestamp: int
    status: str
    fee: int

# Util for safe environment variable fetching
def get_env(key: str, fallback: Optional[str] = None) -> str:
    """Safely get an environment variable.
    
    Args:
        key: Environment variable name
        fallback: Optional fallback value if environment variable is not set
        
    Returns:
        The value of the environment variable or fallback
        
    Raises:
        ValidationError: If environment variable is not set and no fallback provided
    """
    value = os.getenv(key)
    if value is not None:
        return value
    if fallback is not None:
        return fallback
    raise ValidationError(f"Missing required environment variable: {key}")

async def get_wallet_tokens(wallet_address: str) -> Dict[str, Any]:
    """
    Fetch token holdings and balances for a Solana wallet using Helius API.
    
    Args:
        wallet_address: The wallet address to fetch tokens for
        
    Returns:
        Dict containing token information
    """
    if not wallet_address or not isinstance(wallet_address, str):
        raise ValidationError("Invalid wallet address provided")
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Nosana/1.0"
    }
    
    # Helius RPC request payload for token accounts
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            wallet_address,
            {
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
            },
            {
                "encoding": "jsonParsed"
            }
        ]
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            logger.info(f"Fetching tokens for wallet: {wallet_address}")
            
            async with session.post(
                HELIUS_TOKEN_BALANCE_ENDPOINT,
                headers=headers,
                json=payload,
                timeout=REQUEST_TIMEOUT
            ) as resp:
                response_text = await resp.text()
                
                # Log the response status and headers for debugging
                logger.debug(f"Response status: {resp.status}")
                logger.debug(f"Response headers: {dict(resp.headers)}")
                
                if resp.status == 200:
                    try:
                        data = await resp.json()
                        
                        if "result" not in data:
                            error_msg = f"Unexpected response format from Helius API: {response_text[:500]}"
                            logger.error(error_msg)
                            raise APIError("Invalid response format from Helius API")
                        
                        tokens = []
                        for item in data.get("result", {}).get("value", []):
                            token_info = item.get("account", {}).get("data", {}).get("parsed", {}).get("info", {})
                            token_amount = token_info.get("tokenAmount", {})
                            
                            if token_amount.get("amount") == "0":
                                continue  # Skip tokens with zero balance
                                
                            token_data = {
                                "mint": token_info.get("mint"),
                                "owner": wallet_address,
                                "amount": int(token_amount.get("amount", 0)),
                                "decimals": token_amount.get("decimals", 9),
                                "ui_amount": float(token_amount.get("uiAmount", 0)),
                                "symbol": "",  # Will be filled by get_token_metadata
                                "name": ""      # Will be filled by get_token_metadata
                            }
                            tokens.append(token_data)
                        
                        # Get token metadata for each token
                        tokens_with_metadata = []
                        for token in tokens:
                            try:
                                metadata = await get_token_metadata(token["mint"])
                                token.update(metadata.get("meta", {}))
                                tokens_with_metadata.append(token)
                            except Exception as e:
                                logger.warning(f"Failed to fetch metadata for token {token['mint']}: {str(e)}")
                                tokens_with_metadata.append(token)
                        
                        return {
                            "tokens": tokens_with_metadata,
                            "total_tokens": len(tokens_with_metadata),
                            "source": "helius"
                        }
                        
                    except (json.JSONDecodeError, ValueError, KeyError) as e:
                        error_msg = f"Failed to parse Helius response: {str(e)}"
                        logger.error(f"{error_msg}\nResponse: {response_text[:500]}")
                        raise APIError(error_msg)
                        
                elif resp.status == 429:  # Rate limited
                    retry_after = resp.headers.get('Retry-After', '60')
                    error_msg = f"Rate limited. Please try again after {retry_after} seconds."
                    logger.warning(error_msg)
                    raise APIError(error_msg)
                    
                elif resp.status == 401:  # Unauthorized
                    error_msg = "Invalid or expired Helius API key."
                    logger.error(error_msg)
                    raise APIError(error_msg)
                    
                else:
                    error_msg = f"Helius API error: {resp.status} {resp.reason}"
                    logger.error(f"{error_msg}\nResponse: {response_text[:500]}")
                    raise APIError(error_msg)
                    
    except asyncio.TimeoutError:
        error_msg = f"Request to Helius API timed out after {REQUEST_TIMEOUT} seconds"
        logger.error(error_msg)
        raise APIError(error_msg)
        
    except aiohttp.ClientError as ce:
        error_msg = f"Network error while connecting to Helius API: {str(ce)}"
        logger.error(error_msg)
        raise APIError(error_msg)
        
    except Exception as e:
        logger.error(f"Unexpected error in get_wallet_tokens: {str(e)}", exc_info=True)
        raise APIError("Unexpected error in get_wallet_tokens") from e

async def get_wallet_activity(wallet_address: str, limit: int = 50) -> Dict[str, Any]:
    """Fetch transaction history for a Solana wallet using Helius API.
    
    Args:
        wallet_address: The Solana wallet address to query
        limit: Maximum number of transactions to return (1-100)
        
    Returns:
        Dictionary containing transaction history
    """
    if not wallet_address or not isinstance(wallet_address, str):
        raise ValidationError("Invalid wallet address provided")
    
    limit = max(1, min(100, int(limit)))  # Ensure limit is between 1 and 100
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Nosana/1.0"
    }
    
    # Helius RPC request payload for transaction history
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getSignaturesForAddress",
        "params": [
            wallet_address,
            {
                "limit": limit
            }
        ]
    }
    
    try:
        async with aiohttp.ClientSession() as session:
            logger.info(f"Fetching transaction history for wallet: {wallet_address}")
            
            async with session.post(
                HELIUS_TOKEN_BALANCE_ENDPOINT,  # Reusing the same endpoint
                headers=headers,
                json=payload,
                timeout=REQUEST_TIMEOUT
            ) as resp:
                response_text = await resp.text()
                
                if resp.status == 200:
                    data = await resp.json()
                    
                    if "result" not in data:
                        error_msg = "Unexpected response format from Helius API"
                        logger.error(f"{error_msg}: {response_text[:500]}")
                        raise APIError(error_msg)
                    
                    # Process transaction signatures
                    signatures = [tx["signature"] for tx in data.get("result", [])]
                    
                    # Return basic transaction info (can be enhanced to fetch full transaction details)
                    return {
                        "transactions": [
                            {
                                "signature": tx["signature"],
                                "slot": tx.get("slot"),
                                "blockTime": tx.get("blockTime"),
                                "memo": tx.get("memo"),
                                "err": tx.get("err")
                            }
                            for tx in data.get("result", [])
                        ],
                        "total": len(signatures),
                        "source": "helius"
                    }
                
                elif resp.status == 429:  # Rate limited
                    retry_after = resp.headers.get('Retry-After', '60')
                    error_msg = f"Rate limited. Please try again after {retry_after} seconds."
                    logger.warning(error_msg)
                    raise APIError(error_msg)
                    
                elif resp.status == 401:  # Unauthorized
                    error_msg = "Invalid or expired Helius API key."
                    logger.error(error_msg)
                    raise APIError(error_msg)
                    
                else:
                    error_msg = f"Helius API error: {resp.status} {resp.reason}"
                    logger.error(f"{error_msg}\nResponse: {response_text[:500]}")
                    raise APIError(error_msg)
                    
    except asyncio.TimeoutError:
        error_msg = f"Request to Helius API timed out after {REQUEST_TIMEOUT} seconds"
        logger.error(error_msg)
        raise APIError(error_msg)
        
    except aiohttp.ClientError as ce:
        error_msg = f"Network error while connecting to Helius API: {str(ce)}"
        logger.error(error_msg)
        raise APIError(error_msg)
        
    except Exception as e:
        logger.error(f"Unexpected error in get_wallet_activity: {str(e)}", exc_info=True)
        raise APIError("Failed to fetch wallet activity") from e
                
    except Exception as e:
        if not isinstance(e, (APIError, ValidationError)):
            error_msg = f"Unexpected error in get_wallet_activity: {str(e)}"
            logger.exception(error_msg)
            raise APIError(error_msg) from e
        raise

async def get_token_metadata(token_address: str) -> Dict[str, Any]:
    """
    Fetch metadata for a specific token using Helius API.
    
    Args:
        token_address: The token mint address
        
    Returns:
        Dict containing token metadata
    """
    if not token_address or not isinstance(token_address, str):
        raise ValidationError("Invalid token address provided")
    
    # Known token metadata for common tokens
    known_tokens = {
        "So11111111111111111111111111111111111111112": {
            "meta": {
                "name": "Wrapped SOL",
                "symbol": "SOL",
                "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
            }
        },
        "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": {
            "meta": {
                "name": "USD Coin",
                "symbol": "USDC",
                "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png"
            }
        },
        "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB": {
            "meta": {
                "name": "Tether USD",
                "symbol": "USDT",
                "logo": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg"
            }
        }
    }
    
    # Return known token metadata if available
    if token_address in known_tokens:
        return known_tokens[token_address]
    
    # For other tokens, try to fetch metadata from token-list
    try:
        token_list_url = f"https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json"
        
        async with aiohttp.ClientSession() as session:
            async with session.get(token_list_url, timeout=REQUEST_TIMEOUT) as resp:
                if resp.status == 200:
                    token_list = await resp.json()
                    for token in token_list.get("tokens", []):
                        if token.get("address") == token_address:
                            return {
                                "meta": {
                                    "name": token.get("name", "Unknown Token"),
                                    "symbol": token.get("symbol", "UNKNOWN"),
                                    "logo": token.get("logoURI", "")
                                }
                            }
    except Exception as e:
        logger.warning(f"Error fetching token list: {str(e)}")
    
    # Fallback to minimal metadata
    return {"meta": {"name": "Unknown Token", "symbol": "UNKNOWN"}}

# For backward compatibility
get_token_meta = get_token_metadata
