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

    console.log('🆘 || hostParts:', hostParts);

    if (hostParts[0] == rootHost) {
      throw new BadRequestException('Root host not allowed');
    }

    let tenantId = hostParts[0];

    console.log('🆘 || tenantId:', tenantId);
    // get tenant from subdomain
    if (!tenantId) {
      throw new BadRequestException('Tenant not found');
    }
    next();
  }
}
