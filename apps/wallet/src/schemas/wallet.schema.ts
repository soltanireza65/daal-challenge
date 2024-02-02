import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {

    @Prop()
    user_id: number;

    @Prop()
    balance: number;

    @Prop({default: now()})
    createdAt: Date;

    @Prop({default: now()})
    updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);