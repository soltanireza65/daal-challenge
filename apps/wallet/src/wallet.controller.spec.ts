import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { Types } from 'mongoose';

describe('WalletController', () => {
  let controller: WalletController;
  let fakeService: Partial<WalletService>;
  let balance;

  beforeEach(async () => {
    balance = 0
    fakeService = {
      _userIds: [1, 2],
      getUserBalance(user_id: number) {
        if (!this._userIds.includes(user_id)) throw new Error('Invalid user id')
        return Promise.resolve({
          user_id,
          balance
        } as any);
      },
      updateBallance(user_id, amount): Promise<{
        user_id: number;
        balance: number;
        reference_id: Types.ObjectId;
      }> {
        balance += amount
        return Promise.resolve({
          user_id,
          balance: balance,
          reference_id: new Types.ObjectId("507f1f77bcf86cd799439011")
        });
      },
    } as Partial<WalletService>;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [{ provide: WalletService, useValue: fakeService }],
    }).compile();

    controller = app.get<WalletController>(WalletController);
  });

  it('should return wallet balance given user id', async () => {
    // act
    const balance = await controller.getUserBalance("1");

    // assert
    expect(balance).toEqual({ user_id: 1, balance: 0 });
  });
  it('should throw error if invalid user id', async () => {
    try {
      // act
      await controller.getUserBalance("10");
    } catch (error) {
      // assert
      expect(error.message).toEqual('Invalid user id');
    }
  });

  it('should increase wallet balance', async () => {
    // act
    await controller.updateBallance({ user_id: 1, amount: 100 });
    const balance = await controller.updateBallance({ user_id: 1, amount: 100 });

    // assert
    expect(balance.user_id).toEqual(1);
    expect(balance.balance).toEqual(200);
  })

  it('should return reference_id after updating wallet', async () => {
    // act
    const balance = await controller.updateBallance({ user_id: 1, amount: 100 });

    // assert
    expect(balance.reference_id).toBeDefined();
  })

  it('should throw error updating wallet with insufficient funds', async () => {
    try {
      await controller.updateBallance({ user_id: 1, amount: -100 });
    } catch (error) {
      expect(error.message).toEqual('Insufficient funds');
    }
  })

  it('should throw error updating wallet with invalid user', async () => {
    try {
      // act
      await controller.updateBallance({ user_id: 10, amount: -100 });
    } catch (error) {
      // assert
      expect(error.message).toEqual('Invalid user id');
    }
  });
});
