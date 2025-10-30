const HELIUS_API_KEY = 'c5ff6d8a-44c0-4a0b-8e81-3cd87e03bd41';
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export interface TokenBalance {
  mint: string;
  amount: string;
  decimals: number;
  tokenAccount: string;
  tokenMetadata?: {
    name: string;
    symbol: string;
    image?: string;
  };
  priceInfo?: {
    pricePerToken: number;
    totalPrice: number;
  };
}

export interface Transaction {
  signature: string;
  timestamp: string;
  type: string;
  fee: number;
  status: string;
}

export async function getWalletTokens(walletAddress: string): Promise<TokenBalance[]> {
  try {
    const response = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-test',
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          {
            programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          },
          {
            encoding: 'jsonParsed',
            commitment: 'confirmed',
          },
        ],
      }),
    });

    const { result } = await response.json();
    
    if (!result?.value) {
      return [];
    }

    // Filter out tokens with zero balance and map to our interface
    const tokens = result.value
      .filter((token: any) => token.account.data.parsed.info.tokenAmount.uiAmount > 0)
      .map((token: any) => ({
        mint: token.account.data.parsed.info.mint,
        amount: token.account.data.parsed.info.tokenAmount.amount,
        decimals: token.account.data.parsed.info.tokenAmount.decimals,
        tokenAccount: token.pubkey,
        tokenMetadata: {
          name: token.account.data.parsed.info.tokenAmount.uiAmountString,
          symbol: 'TOKEN', // Will be updated with actual symbol if available
        },
      }));

    return tokens;
  } catch (error) {
    console.error('Error fetching wallet tokens:', error);
    return [];
  }
}

export async function getWalletTransactions(walletAddress: string, limit = 10): Promise<Transaction[]> {
  try {
    const response = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-tx',
        method: 'getSignaturesForAddress',
        params: [
          walletAddress,
          {
            limit,
          },
        ],
      }),
    });

    const { result } = await response.json();
    
    if (!result) {
      return [];
    }

    return result.map((tx: any) => ({
      signature: tx.signature,
      timestamp: new Date(tx.blockTime * 1000).toISOString(),
      type: 'Unknown',
      fee: 0,
      status: tx.confirmationStatus || 'confirmed',
    }));
  } catch (error) {
    console.error('Error fetching wallet transactions:', error);
    return [];
  }
}

export async function getWalletBalance(walletAddress: string): Promise<number> {
  try {
    const response = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'helius-balance',
        method: 'getBalance',
        params: [walletAddress],
      }),
    });

    const { result } = await response.json();
    return (result?.value || 0) / 1e9; // Convert lamports to SOL
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return 0;
  }
}
