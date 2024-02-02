import { Controller, Get } from '@nestjs/common';
import { AuditService } from './audit.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { AuditLogEventData } from '@app/common/events/audit.event';
import { EVENT_WALLET_TOPUP } from '@app/common/constants/events';

@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) { }

  @Get()
  async getAuditLogs() {
    return await this.auditService.getAuditLogs()
  }

  @EventPattern(EVENT_WALLET_TOPUP)
  async handleCreateAuditLog(@Payload() data: AuditLogEventData, @Ctx() ctx: RmqContext) {
    this.auditService.createAuditLog(data)
  }
}
