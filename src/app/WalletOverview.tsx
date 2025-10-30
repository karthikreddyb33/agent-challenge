import React from "react";

interface WalletOverviewProps {
  wallet: string;
  trustScore: number;
  lastUpdated: string;
  totalSol: number;
  tokenCount: number;
  highRiskCount: number;
}

const WalletOverview: React.FC<WalletOverviewProps> = ({
  wallet,
  trustScore,
  lastUpdated,
  totalSol,
  tokenCount,
  highRiskCount,
}) => {
  return (
    <div className="bg-white/20 backdrop-blur p-6 rounded-2xl shadow-xl flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-gray-200">{wallet}</span>
        <span className="text-xs text-gray-400">Last updated: {lastUpdated}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="text-lg font-bold text-white">Trust Score</div>
          <div className="w-full bg-gray-700 rounded-full h-3 mt-1">
            <div
              className={`h-3 rounded-full ${trustScore > 70 ? "bg-green-400" : trustScore > 40 ? "bg-yellow-400" : "bg-red-500"}`}
              style={{ width: `${trustScore}%` }}
            />
          </div>
          <div className="text-xs text-gray-200 mt-1">{trustScore}/100</div>
        </div>
        <div className="flex flex-col gap-2 text-white/90">
          <div>Total SOL: <span className="font-mono">{totalSol}</span></div>
          <div>Tokens: <span className="font-mono">{tokenCount}</span></div>
          <div>High-Risk: <span className="font-mono text-red-400">{highRiskCount}</span></div>
        </div>
      </div>
    </div>
  );
};

export default WalletOverview;
