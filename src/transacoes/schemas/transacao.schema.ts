import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransacaoDocument = HydratedDocument<Transacao>;

@Schema({ timestamps: true })
export class Transacao {
  @Prop({ required: true, trim: true, minlength: 1 })
  descricao!: string;

  @Prop({ required: true, min: 0.01 })
  valor!: number;

  @Prop({ required: true, enum: ['receita', 'despesa'] })
  tipo!: 'receita' | 'despesa';

  @Prop({ required: true, trim: true, minlength: 1 })
  categoria!: string;

  // true = gasto consciente/essencial; false = gasto não essencial/impulso.
  // Para receitas, essa informação não participa do cálculo das métricas.
  @Prop({ required: true, default: false })
  consumoConsciente!: boolean;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
