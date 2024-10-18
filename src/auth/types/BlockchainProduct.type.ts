export interface BlockchainProduct {
  owner: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
  buyers: string[];
  amountBought: number[];
}
