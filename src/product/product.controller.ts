import { Controller, Get, Req } from '@nestjs/common';

@Controller('product')
export class ProductController {
    @Get()
    getProducts(@Req() req: Request): string {
        const tenantId = req['tenantId'];
        return tenantId+"'s products";
    }
}
