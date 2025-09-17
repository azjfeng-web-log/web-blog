import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreationService } from './creation.service';
import { AuthGuard } from '@src/auth/auth.guard';

@Controller('creation')
export class CreationController {
  constructor(private readonly creationService: CreationService) {}
  @UseGuards(AuthGuard)
  @Post('hunyuan')
  @HttpCode(HttpStatus.OK)
  async hunyuanImage(@Body() body: any) {
    const { action, payload, service, version, region } = body;
    const result = await this.creationService.hunyuanImage(payload, {
      action,
      service,
      version,
      region,
      host: `${service}.tencentcloudapi.com`,
      url: `https://${service}.tencentcloudapi.com`,
    });
    return {
      code: 0,
      message: 'ok',
      data: {
        ...result,
      },
    };
  }
}
