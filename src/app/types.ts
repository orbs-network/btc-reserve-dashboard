
export type User = {
    authorized: boolean,
    email: string,
    emailVerified: boolean,
    avatar: string,
    lastName: string,
    firstName: string,
    isAdmin: boolean,
    id: string,
}
export type ParsedSheetRecord = {
    email: string,
    name: string,
    purchases: Purchase[],
    totalBTC: string,
    avgPurchasePrice: string,
    totalFiatSpent: string,
};



export interface Purchase {
    timestamp: number;
    price: number;
    btc: number;
  }
  