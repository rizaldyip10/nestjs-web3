import { Controller } from '@nestjs/common';
import { ThirdwebService } from './thirdweb.service';

@Controller('thirdweb')
export class ThirdwebController {
  constructor(private readonly thirdwebService: ThirdwebService) {}
}
