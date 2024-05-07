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
    
    let tenantId = hostParts[0];
    if (!tenantId) {
      throw new BadRequestException('Tenant not found');
    }
    if (tenantId == rootHost) {
      throw new BadRequestException('Root host not allowed');
    }
    req.tenantId = tenantId;
    next();
  }
}
