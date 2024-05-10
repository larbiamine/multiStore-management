import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { MyConfigService } from 'src/config/config.service';
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private configService: MyConfigService) {}
  async use(req: any, res: any, next: () => void) {
    // get subdomain from request
    const host = req.headers.host;

    const hostParts = host.split('.');
    const rootHost = this.configService.getRootHost();
    
    let storeId = hostParts[0];
    if (!storeId) {
      throw new BadRequestException('Store not found');
    }
    if (storeId == rootHost) {
      throw new BadRequestException('Root host not allowed');
    }
    req.storeId = "store_"+storeId;
    next();
  }
}
