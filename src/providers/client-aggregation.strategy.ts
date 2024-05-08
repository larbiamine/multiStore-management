import {
    ContextId,
    ContextIdFactory,
    ContextIdStrategy,
    HostComponentInfo,
  } from '@nestjs/core';
  import { Request } from 'express';
  
  const tenants = new Map<string, ContextId>();
  
  export class AggregateByTenantContextIdStrategy implements ContextIdStrategy {
    attach(contextId: ContextId, request: Request) {
        const tenantId = request["tenantId"];
      /* Extract the tenant identifier from the 
         request object into the tenantId variable */
  
      let tenantSubTreeId: ContextId;
      if (tenants.has(tenantId)) {
        tenantSubTreeId = tenants.get(tenantId);
      } else {
        tenantSubTreeId = ContextIdFactory.create();
        tenants.set(tenantId, tenantSubTreeId);
      }
  
      return {
        resolve: (info: HostComponentInfo) =>
          info.isTreeDurable ? tenantSubTreeId : contextId,
        payload: { tenantId },
      };
    }
  }