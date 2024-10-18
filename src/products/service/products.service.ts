import { CreateProductDto } from '../dto/create-product.dto';
// import { UpdateProductDto } from '../dto/update-product.dto';
import { ThirdwebService } from 'src/thirdweb/thirdweb.service';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'src/utils/response.utils';
import { Account } from 'thirdweb/dist/types/wallets/interfaces/wallet';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private thirdwebService: ThirdwebService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const isProductExist = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (isProductExist) {
      throw new ConflictException(
        Response.failed(HttpStatus.CONFLICT, 'Product already exist', null),
      );
    }

    const newProduct = new Product();

    let account: Account;

    Object.assign(newProduct, createProductDto);

    await this.thirdwebService.createProduct({
      ...createProductDto,
      account,
    });

    return await this.productRepository.save(newProduct);
  }

  async findAll() {
    return await this.productRepository.find({
      relations: ['owner'],
    });
  }

  findOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
    });
  }

  // update(id: number, updateProductDto: UpdateProductDto) {
  //   return `This action updates a #${id} product`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} product`;
  // }
}
