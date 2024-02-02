import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

describe('WalletController', () => {
  let controller: AuditController;
  let fakeService: Partial<AuditService>;
  let balance;

  beforeEach(async () => {
    balance = 0
    fakeService = {
      getAuditLogs() {
        return Promise.resolve([
          {
            "user_id": 1,
            "action": "WALLET:DEPOSIT",
            "createdAt": "2024-02-02T12:47:26.132Z",
            "updatedAt": "2024-02-02T12:47:26.132Z"
          } as any
        ])
      },
    } as Partial<AuditService>;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuditController],
      providers: [{ provide: AuditService, useValue: fakeService }],
    }).compile();

    controller = app.get<AuditController>(AuditController);
  });

  it('should return audit logs', async () => {
    // act
    const logs = await controller.getAuditLogs();

    // assert
    expect(logs.length).toEqual(1);
  });
});
