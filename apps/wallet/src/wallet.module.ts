import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from "joi"
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './schemas/wallet.schema';
import { TransactionSchema } from './schemas/transaction.schema';
import { RmqModule } from '@app/common';
import { AUDIT_SERVICE } from '@app/common/constants/services';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/wallet/.env'
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: "Wallet", schema: WalletSchema },
      { name: "Transaction", schema: TransactionSchema },
    ]),
    RmqModule.register({ name: AUDIT_SERVICE }),
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule { }
