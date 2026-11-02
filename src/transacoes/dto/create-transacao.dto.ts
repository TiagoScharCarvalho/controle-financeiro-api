import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTransacaoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  descricao!: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  valor!: number;

  @IsString()
  @IsIn(['receita', 'despesa'])
  tipo!: 'receita' | 'despesa';

  @IsString()
  @MinLength(1)
  @MaxLength(60)
  categoria!: string;

  @IsBoolean()
  consumoConsciente!: boolean;
}
