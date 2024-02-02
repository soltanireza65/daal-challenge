import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema()
export class Transaction  {

    @Prop()
    amount: number;

    @Prop()
    user_id: number;

    @Prop({default: now()})
    createdAt: Date;

    @Prop({default: now()})
    updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);