import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ThirdwebService } from './thirdweb.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { Account } from 'thirdweb/dist/types/wallets/interfaces/wallet';

@Controller('thirdweb')
export class ThirdwebController {
  constructor(private readonly thirdwebService: ThirdwebService) {}

  @Post()
  async createProduct(@Body() createProductDto: CreateProductDTO) {
    return await this.thirdwebService.createProduct(createProductDto);
  }

  @Get()
  async getProducts() {
    return await this.thirdwebService.getProducts();
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: number) {
    return await this.thirdwebService.getProduct(productId);
  }

  @Post('buy/:id')
  async buyProduct(@Param('id') productId: number, @Body() account: Account) {
    return await this.thirdwebService.buyProduct(productId, account);
  }

  @Get('buyers/:id')
  async getBuyers(@Param('id') productId: number) {
    return await this.thirdwebService.getBuyers(productId);
  }
}
