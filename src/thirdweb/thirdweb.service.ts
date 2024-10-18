import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
  sendTransaction,
  ThirdwebClient,
} from 'thirdweb';
import { defineChain } from 'thirdweb/chains';
import { ConfigService } from '@nestjs/config';
import { Account } from 'thirdweb/dist/types/wallets/interfaces/wallet';
import { BlockchainProduct } from 'src/thirdweb/types/BlockchainProduct.type';
import { CreateProductDTO } from './dto/create-product.dto';

@Injectable()
export class ThirdwebService implements OnModuleInit {
  private client: ThirdwebClient;
  private contractInstance: any; // Replace 'any' with a more specific type if available

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeThirdwebClient();
    this.connectToContract();
  }

  private initializeThirdwebClient() {
    const clientId = this.configService.get<string>('THIRDWEB_CLIENT_ID');
    this.client = createThirdwebClient({
      clientId: clientId,
    });
  }

  private connectToContract() {
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');
    this.contractInstance = getContract({
      client: this.client,
      chain: defineChain(11155111), // Sepolia testnet
      address: contractAddress,
    });
  }

  getContract() {
    return this.contractInstance;
  }

  async buyProduct(productId: number, account: Account): Promise<string> {
    try {
      const transaction = await prepareContractCall({
        contract: this.contractInstance,
        method: 'function buyProduct(uint256 _productId) payable',
        params: [BigInt(productId - 1)],
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      return transactionHash;
    } catch (error) {
      console.error('Error buying product:', error);
      throw new Error('Failed to buy product');
    }
  }

  async createProduct(createProductDto: CreateProductDTO): Promise<string> {
    try {
      const { owner, name, description, price, stocks, image, account } =
        createProductDto;
      const transaction = await prepareContractCall({
        contract: this.contractInstance,
        method:
          'function createProduct(address _owner, string _name, string _description, uint256 _price, uint256 _stocks, string _image) returns (uint256)',
        params: [
          owner,
          name,
          description,
          BigInt(price),
          BigInt(stocks),
          image,
        ],
      });

      const { transactionHash } = await sendTransaction({
        transaction,
        account,
      });

      return transactionHash;
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  async getBuyers(
    productId: number,
  ): Promise<{ addresses: string[]; quantities: number[] }> {
    try {
      const data = await readContract({
        contract: this.contractInstance,
        method:
          'function getBuyers(uint256 _productId) view returns (address[], uint256[])',
        params: [BigInt(productId - 1)],
      });

      const [addresses, quantities] = data;

      return {
        addresses: addresses as string[],
        quantities: quantities.map((q) => Number(q)),
      };
    } catch (error) {
      console.error('Error getting buyers:', error);
      throw new Error('Failed to get buyers');
    }
  }

  async getProducts(): Promise<BlockchainProduct[]> {
    try {
      const data = await readContract({
        contract: this.contractInstance,
        method:
          'function getProducts() view returns ((address owner, string name, string description, uint256 price, uint256 stocks, string image, address[] buyers, uint256[] amountBought)[])',
        params: [],
      });

      // Convert the returned data to our Product interface
      const products: BlockchainProduct[] = data.map(
        (product: any, index: number) => ({
          id: index + 1,
          owner: product.owner,
          name: product.name,
          description: product.description,
          price: Number(product.price),
          stocks: Number(product.stocks),
          image: product.image,
          buyers: product.buyers,
          amountBought: product.amountBought.map((amount: any) =>
            Number(amount),
          ),
        }),
      );

      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to get products');
    }
  }

  async getProduct(productId: number) {
    try {
      const data = await readContract({
        contract: this.contractInstance,
        method:
          'function getProduct(uint256 _productId) view returns ((address owner, string name, string description, uint256 price, uint256 stocks, string image, address[] buyers, uint256[] amountBought))',
        params: [BigInt(productId - 1)],
      });

      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product from blockchain');
    }
  }
}
