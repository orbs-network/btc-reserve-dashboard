
export type User = {
    authorized: boolean,
    email: string,
    emailVerified: boolean,
    avatar: string,
    lastName: string,
    firstName: string,
    isAdmin: boolean,
}
export type ParsedSheetRecord = {
    email: string,
    name: string,
    purchases: Purchase[],
    totalBTC: number,
    avgPurchasePrice: number,
    totalSpent: number,
};



export interface Purchase {
    date: string;
    price: number;
    btc: number;
  }
  