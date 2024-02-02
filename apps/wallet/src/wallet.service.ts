import { ACTION_WALLET_DEPOSIT, ACTION_WALLET_WITHDRAW } from '@app/common';
import { EVENT_WALLET_TOPUP } from '@app/common';
import { AUDIT_SERVICE } from '@app/common';
import { AuditLogEventData } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { Transaction } from './schemas/transaction.schema';
import { Wallet } from './schemas/wallet.schema';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class WalletService {

  private readonly logger = new Logger(WalletService.name);

  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    @InjectConnection() private connection: Connection,
    @Inject(AUDIT_SERVICE) private readonly auditClient: ClientProxy
  ) { }

  async getUserBalance(user_id: number) {
    let wallet = await this.walletModel.findOne({ user_id })

    if (!wallet) {
      wallet = new this.walletModel({ user_id, balance: 0 });
      await wallet.save();
    }

    return {
      user_id,
      balance: wallet?.balance,
    }
  }

  async updateBallance(user_id: number, amount: number) {
    let wallet = await this.walletModel.findOne({ user_id })


    const session = await this.startTransaction();

    try {
      if (!wallet) {
        wallet = new this.walletModel({ user_id, balance: amount });
        await wallet.save();
      } else {
        if (wallet.balance + amount < 0) throw new Error('Insufficient funds')
        wallet.balance += amount
        await wallet.save()
      }

      const transaction = new this.transactionModel({
        amount: amount,
        user_id: user_id,
      });

      const event: AuditLogEventData = {
        action: amount > 0 ? ACTION_WALLET_DEPOSIT : ACTION_WALLET_WITHDRAW,
        user_id,
      }

      await lastValueFrom(
        this.auditClient.emit(EVENT_WALLET_TOPUP, event)
      )

      await transaction.save();

      await session.commitTransaction();

      return {
        user_id,
        balance: wallet?.balance,
        reference_id: transaction._id
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    }
  }

  @Cron('0 0 * * *') // Runs every day at midnight
    async calculateAndLogTotalTransactions() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const totalTransactions = await this.transactionModel.countDocuments({
          createdAt: { $gte: today, $lt: tomorrow }
        });

        this.logger.log(`Total transactions processed today: ${totalTransactions}`);
      } catch (error) {
        this.logger.error('Error calculating and logging total transactions', error);
      }
    }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
