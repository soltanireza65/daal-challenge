import { Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuditLogEventData } from '@app/common';
import { EVENT_WALLET_TOPUP } from '@app/common';
import { Serialize } from '@app/common/interceptors/serializer.interceptor';
import { AuditDto } from './dtos/audit.dto';

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) { }

  @Get()
  @Serialize(AuditDto)
  async getAuditLogs() {
    return await this.auditService.getAuditLogs()
  }

  @EventPattern(EVENT_WALLET_TOPUP)
  async handleCreateAuditLog(@Payload() data: AuditLogEventData, @Ctx() ctx: RmqContext) {
    this.auditService.createAuditLog(data)
  }
}
