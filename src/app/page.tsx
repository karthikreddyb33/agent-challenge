'use client';

import { useState, useEffect } from 'react';

export default function HomePage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const analyzeWallet = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      console.log(`[DEBUG] Starting analysis for wallet: ${walletAddress}`);
      
      const response = await fetch(`/api/analyze_wallet?t=${timestamp}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        body: JSON.stringify({ 
          wallet: walletAddress,
          timestamp: timestamp
        }),
        cache: 'no-store'
      });

      // Read the response body once and store it
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error('Invalid response from server. Please try again.');
      }

      if (!response.ok) {
        console.error('API Error:', response.status, responseData);
        let errorMessage = 'An error occurred while analyzing the wallet';
        
        if (responseData?.error) {
          errorMessage = responseData.error;
          if (responseData.details) {
            errorMessage += `: ${responseData.details}`;
          }
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (response.status === 400) {
          errorMessage = 'Invalid request. Please check the wallet address and try again.';
        }
        
        throw new Error(errorMessage);
      }

      // Process the token_forensics to ensure it's in the correct format
      if (responseData.detailed?.token_forensics) {
        const processedTokenForensics: Record<string, any> = {};
        
        // Handle case where token_forensics is an object with string keys
        Object.entries(responseData.detailed.token_forensics).forEach(([key, value]) => {
          try {
            // If the key looks like a JSON string, try to parse it
            if (key.startsWith('{') && key.endsWith('}')) {
              try {
                const tokenInfo = JSON.parse(key);
                const address = tokenInfo.mint || key;
                processedTokenForensics[address] = {
                  ...(value as object),
                  name: tokenInfo.name || 'Unknown',
                  symbol: tokenInfo.symbol || 'UNKNOWN',
                  logo: tokenInfo.logo
                };
              } catch (e) {
                console.warn('Failed to parse token info as JSON:', key, e);
                processedTokenForensics[key] = value;
              }
            } else {
              processedTokenForensics[key] = value;
            }
          } catch (e) {
            console.warn('Error processing token info:', key, e);
            processedTokenForensics[key] = {
              ...(value as object),
              error: 'Failed to process token data'
            };
          }
        });
        
        responseData.detailed.token_forensics = processedTokenForensics;
      }

      console.log('Analysis result:', responseData);
      setAnalysisResult(responseData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze wallet';
      console.error('Analysis error:', err);
      setError(`Error: ${errorMessage}. Please try again or contact support if the issue persists.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isClient) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Solana DeFi Sentinel
        </h1>
        <p className="text-center text-white/70 mb-8">AI-Powered Wallet Risk Analysis</p>
        
        {/* Wallet Input */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="flex-1 relative">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter Solana wallet address"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60 pr-12"
              />
              {walletAddress && (
                <button
                  onClick={() => setWalletAddress('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  aria-label="Clear"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
            <div className="relative group">
              <button
                onClick={analyzeWallet}
                disabled={isAnalyzing}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isAnalyzing
                    ? 'bg-purple-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </div>
                ) : (
                  'Analyze Wallet'
                )}
              </button>
              <div className="absolute right-0 mt-2 w-64 bg-white/90 text-gray-800 rounded-lg shadow-xl overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1">
                <div className="p-2 text-sm">
                  <p className="font-medium text-gray-900 mb-2">Try these demo wallets:</p>
                  <ul className="space-y-1">
                    {[
                      { address: 'FksffEqnBRixYGR791Qw2MgdU7zNCpHVFYBL4Fa4qVuH', name: 'Demo Wallet 1' },
                      { address: 'Czfq3xZZDmsdGdUyrNLtRhGc47cXcZtLG4crryfu44zE', name: 'Demo Wallet 2' },
                      { address: '9d9mb8kooFfaD3SctgZtkxQypkshx6ezhbKio89ixyy2', name: 'Demo Wallet 3' },
                    ].map((wallet, index) => (
                      <li key={index}>
                        <button
                          onClick={() => {
                            setWalletAddress(wallet.address);
                            setAnalysisResult(null);
                            setError(null);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm flex items-center justify-between group"
                        >
                          <span className="truncate">{wallet.name}</span>
                          <span className="ml-2 text-xs opacity-70 group-hover:opacity-100">
                            {wallet.address.slice(0, 4)}...{wallet.address.slice(-4)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {error && <p className="mt-2 text-red-400 text-sm">{error}</p>}
        </div>


        {/* Results */}
        {analysisResult && (
          <div className="mt-8 space-y-6">
            {/* Risk Summary Card */}
            <div className="bg-white/5 rounded-xl border border-white/10 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Wallet Analysis</h2>
                  <p className="text-sm text-white/60">Address: {analysisResult.wallet}</p>
                </div>
                <div className={`px-4 py-2 rounded-full mt-4 md:mt-0 ${analysisResult.risk_rating === 'LOW' ? 'bg-green-900/30 text-green-400' : 
                  analysisResult.risk_rating === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' : 
                  'bg-red-900/30 text-red-400'}`}>
                  {analysisResult.risk_rating} RISK
                </div>
              </div>
              
              {/* Risk Score */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-white/80">Trust Score</span>
                  <span className="text-sm font-bold">{analysisResult.trust_score}/100</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${analysisResult.trust_score > 70 ? 'bg-green-500' : 
                    analysisResult.trust_score > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${analysisResult.trust_score}%` }}
                  ></div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium text-white/60 mb-2">Transaction Risk</h3>
                  <p className="text-lg font-semibold">
                    {analysisResult.detailed.transaction_monitor.suspicious ? 'Suspicious' : 'Normal'}
                  </p>
                  <p className="text-sm text-white/60 mt-1">{analysisResult.detailed.transaction_monitor.summary}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium text-white/60 mb-2">Risk Level</h3>
                  <p className="text-lg font-semibold">{analysisResult.detailed.risk_advisor.risk_level}</p>
                  <p className="text-sm text-white/60 mt-1">{analysisResult.detailed.risk_advisor.advice}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h3 className="text-sm font-medium text-white/60 mb-2">Tokens Held</h3>
                  <p className="text-lg font-semibold">{Object.keys(analysisResult.detailed.token_forensics).length}</p>
                  <p className="text-sm text-white/60 mt-1">Different tokens in wallet</p>
                </div>
              </div>

              {/* Token List */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Token Holdings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-white/60 border-b border-white/10">
                        <th className="pb-3">Token</th>
                        <th className="pb-3 text-right">Risk Score</th>
                        <th className="pb-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {Object.entries(analysisResult.detailed.token_forensics).map(([address, token]: [string, any]) => (
                        <tr key={address} className="hover:bg-white/5">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                                {token.symbol ? token.symbol[0] : 'T'}
                              </div>
                              <div>
                                <div className="font-medium">{token.symbol || 'Unknown'}</div>
                                <div className="text-xs text-white/50">{address.slice(0, 6)}...{address.slice(-4)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="inline-block px-3 py-1 rounded-full text-xs font-medium 
                              ${token.risk_score > 70 ? 'bg-red-500/20 text-red-400' : 
                                token.risk_score > 30 ? 'bg-yellow-500/20 text-yellow-400' : 
                                'bg-green-500/20 text-green-400'}">
                              {token.risk_score}
                            </div>
                          </td>
                          <td className="text-right text-sm text-white/70">
                            {token.is_verified ? 'Verified' : 'Unverified'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Summary */}
              <div className="mt-8 p-6 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Security Assessment</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-white/60 mb-1">Overall Risk</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.risk_rating === 'LOW' ? 'bg-green-500' :
                          analysisResult.risk_rating === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{analysisResult.risk_rating}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-sm text-white/60 mb-1">Trust Score</p>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              analysisResult.trust_score > 70 ? 'bg-green-500' : 
                              analysisResult.trust_score > 30 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${analysisResult.trust_score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{analysisResult.trust_score}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-white/90">Analysis Status</h4>
                        <p className="text-sm text-white/60 mt-1">
                          Basic security assessment completed. {analysisResult.detailed.token_forensics ? `${Object.keys(analysisResult.detailed.token_forensics).length} tokens analyzed` : 'No tokens found'}.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-white/90">Recommendation</h4>
                        <p className="text-sm text-white/60 mt-1">
                          {analysisResult.detailed.risk_advisor.advice || 'No specific recommendations available.'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
