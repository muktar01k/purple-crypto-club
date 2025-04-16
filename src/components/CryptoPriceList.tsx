
import React from 'react';
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Search, BarChart4 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

// Mock data for crypto prices
const cryptoPrices = [
  { name: 'Bitcoin', symbol: 'BTC', price: 62435.28, change: 2.4, marketCap: 1224.8 },
  { name: 'Ethereum', symbol: 'ETH', price: 3087.15, change: 1.8, marketCap: 371.5 },
  { name: 'Solana', symbol: 'SOL', price: 143.62, change: 5.2, marketCap: 63.2 },
  { name: 'Cardano', symbol: 'ADA', price: 0.45, change: -1.2, marketCap: 15.9 },
  { name: 'Polkadot', symbol: 'DOT', price: 6.23, change: 3.7, marketCap: 9.1 },
  { name: 'Ripple', symbol: 'XRP', price: 0.51, change: -0.8, marketCap: 28.4 },
  { name: 'Dogecoin', symbol: 'DOGE', price: 0.137, change: 2.1, marketCap: 19.7 },
];

const CryptoPriceList = () => {
  return (
    <Card className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-medium flex items-center">
          <BarChart4 size={18} className="text-crypto-purple mr-2" />
          Cryptocurrency Prices
        </h3>
        
        <div className="relative w-48">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 bg-white/5 border-white/10 text-white"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-transparent">
            <TableRow className="border-b border-white/10">
              <TableHead className="text-gray-400">Cryptocurrency</TableHead>
              <TableHead className="text-gray-400 text-right">Price</TableHead>
              <TableHead className="text-gray-400 text-right">24h Change</TableHead>
              <TableHead className="text-gray-400 text-right">Market Cap (B)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cryptoPrices.map((coin) => (
              <TableRow key={coin.symbol} className="border-b border-white/10 hover:bg-white/5">
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
                <TableCell className="text-white text-right">${coin.marketCap.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default CryptoPriceList;
