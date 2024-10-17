import { Module } from '@nestjs/common';
import { ThirdwebService } from './thirdweb.service';
import { ThirdwebController } from './thirdweb.controller';

@Module({
  controllers: [ThirdwebController],
  providers: [ThirdwebService],
})
export class ThirdwebModule {}
