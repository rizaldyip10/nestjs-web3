import { Account } from 'thirdweb/dist/types/wallets/interfaces/wallet';

export class CreateProductDTO {
  owner: string;
  name: string;
  description: string;
  price: number;
  stocks: number;
  image: string;
  account: Account;
}
