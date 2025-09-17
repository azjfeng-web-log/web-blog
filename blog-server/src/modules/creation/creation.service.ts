import { Injectable } from '@nestjs/common';
import { YunApiUtils } from '@src/shared/yunApiUtils';
const config  = {
  secretKey: '',
  secretId: '',
}

@Injectable()
export class CreationService {
  yunApiUtils;
  constructor() {
    this.yunApiUtils = new YunApiUtils();
  }
  async hunyuanImage(payload: any, serverConfig: any) {
    const result = await this.yunApiUtils.apiRequest(
      {
        ...config,
        ...serverConfig,
      },
      payload,
    );
    return result;
  }
}
