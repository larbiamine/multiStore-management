import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { MyConfigService } from 'src/config/config.service';
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private configService: MyConfigService) {}
  async use(req: any, res: any, next: () => void) {
    // get subdomain from request
    const rootHost = this.configService.getRootHost();
    
    let storeId = this.getStoreId(req)
    if (!storeId) {
      throw new BadRequestException('Store not found');
    }
    if (storeId == rootHost) {
      throw new BadRequestException('Root host not allowed');
    }
    req.storeId = "store_"+storeId;
    next();
  }
  getStoreId(req: any): string {
    const host = req.headers.host;
    const hostParts = host.split('.');
    return  hostParts[0];
  }
}
