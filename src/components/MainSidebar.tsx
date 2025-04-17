
import React from 'react';
import { 
  TrendingUp, 
  LogOut, 
  Home,
  CreditCard,
  LineChart,
  BarChart4,
  User,
  ArrowUpCircle
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter
} from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const MainSidebar = () => {
  const isMobile = useIsMobile();
  
  return (
    <Sidebar 
      side="left" 
      collapsible="icon"
    >
      <SidebarHeader className="p-4">
        <div className="text-xl font-bold text-gradient-purple glow-text">
          DIVO
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Dashboard">
                <Home className="text-crypto-purple" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Investments">
                <CreditCard className="text-crypto-purple" />
                <span>Investments</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Performance" isActive>
                <ArrowUpCircle className="text-green-400" />
                <span className="flex items-center">
                  Investment Growth
                  <span className="ml-2 text-xs bg-green-400/20 text-green-400 px-1.5 rounded-full">+12.4%</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Trending">
                <TrendingUp className="text-crypto-purple" />
                <span>Trending Coins</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Market Data">
                <BarChart4 className="text-crypto-purple" />
                <span>Market Data</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Account">
              <User className="text-crypto-purple" />
              <span>Account</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Logout">
              <LogOut className="text-crypto-purple" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default MainSidebar;
