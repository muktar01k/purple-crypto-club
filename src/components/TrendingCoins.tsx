
import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for trending coins
const trendingCoins = [
  { name: 'Bitcoin', symbol: 'BTC', price: 62435.28, change: 2.4, trending: true },
  { name: 'Ethereum', symbol: 'ETH', price: 3087.15, change: 1.8, trending: true },
  { name: 'Solana', symbol: 'SOL', price: 143.62, change: 5.2, trending: true },
  { name: 'Cardano', symbol: 'ADA', price: 0.45, change: -1.2, trending: false },
  { name: 'Polkadot', symbol: 'DOT', price: 6.23, change: 3.7, trending: true },
];

const TrendingCoins = () => {
  return (
    <Card className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium flex items-center">
          <TrendingUp size={18} className="text-crypto-purple mr-2" />
          Trending Coins
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="border-b border-white/10">
              <TableHead className="text-gray-400">Coin</TableHead>
              <TableHead className="text-gray-400 text-right">Price</TableHead>
              <TableHead className="text-gray-400 text-right">24h Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trendingCoins.filter(coin => coin.trending).slice(0, 3).map((coin) => (
              <TableRow key={coin.symbol} className="border-b border-white/10">
                <TableCell className="text-white font-medium">{coin.name} ({coin.symbol})</TableCell>
                <TableCell className="text-white text-right">${coin.price.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${coin.change >= 0 ? 'text-green-400' : 'text-red-400'} flex items-center justify-end`}>
                  {coin.change >= 0 ? (
                    <TrendingUp size={16} className="mr-1" />
                  ) : (
                    <TrendingDown size={16} className="mr-1" />
                  )}
                  {coin.change}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default TrendingCoins;
