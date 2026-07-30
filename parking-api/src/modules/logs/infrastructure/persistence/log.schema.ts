import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LogHydratedDocument = HydratedDocument<LogDocument>;

@Schema({ collection: 'logs' })
export class LogDocument {
  @Prop({ required: true, index: true })
  action!: string;

  @Prop({ type: String, default: null, index: true })
  actorId!: string | null;

  @Prop({ type: Object, default: {} })
  payload!: Record<string, unknown>;

  @Prop({ required: true, index: true })
  occurredAt!: Date;
}

export const LogSchema = SchemaFactory.createForClass(LogDocument);
