
import React, { useEffect, useState } from 'react';
import { LineChart, Line, YAxis, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

// Generate fake data that shows a steady upward trend for investment performance
const generatePerformanceData = () => {
  const data = [];
  let value = 1000; // Starting investment value
  const days = 30; // 30 days of data
  
  for (let i = 0; i < days; i++) {
    // Mostly increasing with occasional small dips to simulate realistic market behavior
    const dailyChange = (Math.random() > 0.2 ? 1 : -0.3) * (Math.random() * 20);
    value += dailyChange;
    
    // Adding percent change from initial value
    const percentChange = ((value - 1000) / 1000) * 100;
    
    data.push({ 
      value,
      day: i + 1,
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000),
      percentChange: percentChange.toFixed(1)
    });
  }
  
  return data;
};

interface CryptoChartProps {
  className?: string;
}

const CryptoChart: React.FC<CryptoChartProps> = ({ className }) => {
  const [data, setData] = useState(generatePerformanceData());
  
  // Regenerate data every 30 seconds to simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(generatePerformanceData());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate the total percentage change
  const totalChange = data.length > 0 
    ? parseFloat(data[data.length - 1].percentChange)
    : 0;
  
  // Determine the color based on the total change
  const lineColor = totalChange >= 0 ? "#4ade80" : "#f87171";
  
  return (
    <div className={`w-full ${className}`}>
      {/* Performance stats */}
      <div className="flex justify-between mb-2 text-sm">
        <div className="text-gray-400">Initial: $1,000.00</div>
        <div className="text-gray-400">
          Current: ${data.length > 0 ? data[data.length - 1].value.toFixed(2) : "1,000.00"}
        </div>
      </div>
      
      <div className="h-24">
        <ChartContainer 
          config={{
            performance: { 
              theme: { dark: lineColor },
              label: "Performance" 
            }
          }}
        >
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <XAxis dataKey="day" hide />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background/80 backdrop-blur-sm border border-border p-2 rounded-md shadow-md text-xs">
                      <p className="font-medium">Day {payload[0].payload.day}</p>
                      <p>Value: ${payload[0].payload.value.toFixed(2)}</p>
                      <p className={payload[0].payload.percentChange >= 0 ? "text-green-400" : "text-red-400"}>
                        {payload[0].payload.percentChange >= 0 ? "+" : ""}{payload[0].payload.percentChange}%
                      </p>
                    </div>
                  );
                }
                return null;
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={lineColor} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: lineColor }}
              name="performance"
              isAnimationActive={true}
            />
          </LineChart>
        </ChartContainer>
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>30 days ago</span>
        <span className={`font-medium ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {totalChange >= 0 ? '+' : ''}{totalChange}%
        </span>
        <span>Now</span>
      </div>
    </div>
  );
};

export default CryptoChart;
