import { Module } from '@nestjs/common';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';

@Module({
    imports: [],
    controllers: [CreationController],
    providers: [CreationService]
  })
  export class CreationModule {}