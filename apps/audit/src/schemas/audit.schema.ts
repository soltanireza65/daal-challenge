import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';

export type AuditDocument = HydratedDocument<Audit>;

@Schema()
export class Audit {
    @Prop()
    user_id: number;

    @Prop()
    action: string;

    @Prop({ default: now() })
    createdAt: Date;

    @Prop({ default: now() })
    updatedAt: Date;

}

export const AuditSchema = SchemaFactory.createForClass(Audit);