import { AuditLogEventData } from '@app/common/events/audit.event';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Audit } from './schemas/audit.schema';

@Injectable()
export class AuditService {

  constructor(
    @InjectModel(Audit.name) private auditModel: Model<Audit>,
  ) { }

  async getAuditLogs() {
    let audits = await this.auditModel.find()

    return audits
  }

  async createAuditLog(data: AuditLogEventData) {

    const audit = new this.auditModel(data)

    await audit.save()
  }
}
