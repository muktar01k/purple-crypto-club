
interface UserData {
  name: string;
  email: string;
  signupDate: Date;
  investments: Investment[];
  totalProfit: number;
}

export interface Investment {
  id: string;
  amount: number;
  date: Date;
  status: 'pending' | 'available';
  source: 'gift-card' | 'credit-card' | 'other';
  cardDetails?: {
    type: string;
    code: string;
    imageUrl?: string;
  };
  profits: {
    amount: number;
    timestamp: Date;
  }[];
}

const USER_DATA_KEY = 'divo_user_data';

export class UserService {
  static saveUser(name: string, email: string): void {
    const userData: UserData = {
      name,
      email,
      signupDate: new Date(),
      investments: [],
      totalProfit: 0
    };
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
  
  static getUserData(): UserData | null {
    const data = localStorage.getItem(USER_DATA_KEY);
    if (!data) return null;
    
    const userData = JSON.parse(data);
    // Convert string dates back to Date objects
    userData.signupDate = new Date(userData.signupDate);
    userData.investments = userData.investments.map((inv: any) => ({
      ...inv,
      date: new Date(inv.date),
      profits: inv.profits.map((p: any) => ({
        ...p,
        timestamp: new Date(p.timestamp)
      }))
    }));
    
    return userData;
  }
  
  static isUserLoggedIn(): boolean {
    return localStorage.getItem(USER_DATA_KEY) !== null;
  }
  
  static getGreeting(): string {
    const userData = this.getUserData();
    if (!userData) return "Welcome";
    
    const hour = new Date().getHours();
    let greeting = "";
    
    if (hour < 12) {
      greeting = "Good morning";
    } else if (hour < 18) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }
    
    return `${greeting}, ${userData.name} 👋`;
  }
  
  static addInvestment(investment: Omit<Investment, 'id' | 'profits'>): Investment {
    const userData = this.getUserData();
    if (!userData) throw new Error("User not logged in");
    
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      profits: []
    };
    
    userData.investments.push(newInvestment);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    
    return newInvestment;
  }
  
  static updateInvestmentStatus(investmentId: string, status: 'pending' | 'available'): void {
    const userData = this.getUserData();
    if (!userData) throw new Error("User not logged in");
    
    const investment = userData.investments.find(inv => inv.id === investmentId);
    if (!investment) throw new Error("Investment not found");
    
    investment.status = status;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
  
  static recordProfit(investmentId: string, amount: number): void {
    const userData = this.getUserData();
    if (!userData) throw new Error("User not logged in");
    
    const investment = userData.investments.find(inv => inv.id === investmentId);
    if (!investment) throw new Error("Investment not found");
    
    investment.profits.push({
      amount,
      timestamp: new Date()
    });
    
    userData.totalProfit += amount;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }
  
  static getTotalBalance(): number {
    const userData = this.getUserData();
    if (!userData) return 0;
    
    return userData.investments.reduce((total, inv) => {
      if (inv.status === 'available') {
        const profitSum = inv.profits.reduce((sum, p) => sum + p.amount, 0);
        return total + inv.amount + profitSum;
      }
      return total;
    }, 0);
  }
  
  static getPendingBalance(): number {
    const userData = this.getUserData();
    if (!userData) return 0;
    
    return userData.investments.reduce((total, inv) => {
      if (inv.status === 'pending') {
        return total + inv.amount;
      }
      return total;
    }, 0);
  }
}
