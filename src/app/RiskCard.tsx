import React from "react";

interface RiskCardProps {
  symbol: string;
  riskScore: number;
  reason: string;
  liquidityUsd: number;
  topHolderPct: number;
  tokenName: string;
  solscanLink: string;
  onExplain: () => void;
}

const RiskCard: React.FC<RiskCardProps> = ({
  symbol,
  riskScore,
  reason,
  liquidityUsd,
  topHolderPct,
  tokenName,
  solscanLink,
  onExplain,
}) => {
  return (
    <div className="bg-white/10 rounded-xl p-4 shadow flex flex-col gap-2 border border-white/10 hover:border-white/30 transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            {symbol} <span className="text-xs text-gray-300">{tokenName}</span>
          </div>
        </div>
        <a href={solscanLink} target="_blank" rel="noopener noreferrer" className="text-blue-300 underline text-xs">Solscan</a>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold" style={{ color: riskScore > 70 ? '#ef4444' : riskScore > 40 ? '#facc15' : '#22c55e' }}>{riskScore}</div>
        <div className="flex-1 text-sm text-white/80">{reason}</div>
      </div>
      <div className="flex gap-4 text-xs text-white/80">
        <div>Liquidity: <span className="font-mono">${liquidityUsd.toLocaleString()}</span></div>
        <div>Top Holder: <span className="font-mono">{topHolderPct.toFixed(1)}%</span></div>
      </div>
      <button
        onClick={onExplain}
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-lg text-xs font-semibold shadow"
      >
        Explain
      </button>
    </div>
  );
};

export default RiskCard;
