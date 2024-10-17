import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ThirdwebModule } from './thirdweb/thirdweb.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ThirdwebModule,
    ProductsModule,
    AuthModule,
  ],
})
export class AppModule {}
