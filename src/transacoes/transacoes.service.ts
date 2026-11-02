import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { Transacao, TransacaoDocument } from './schemas/transacao.schema';

export interface MetricasFinanceiras {
  saldoTotal: number;
  totalDespesas: number;
  totalGastoImpulso: number;
}

export interface ResumoTransacoes {
  historico: TransacaoDocument[];
  metricas: MetricasFinanceiras;
}

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<Transacao>,
  ) {}

  async create(dados: CreateTransacaoDto): Promise<TransacaoDocument> {
    const novaTransacao = new this.transacaoModel(dados);
    return novaTransacao.save();
  }

  async findAll(): Promise<ResumoTransacoes> {
    const historico = await this.transacaoModel
      .find()
      .sort({ createdAt: -1 })
      .exec();

    // As métricas são calculadas no Service, conforme solicitado no exercício.
    const totais = historico.reduce(
      (acumulado, transacao) => {
        if (transacao.tipo === 'receita') {
          acumulado.receitas += transacao.valor;
        } else {
          acumulado.despesas += transacao.valor;

          if (transacao.consumoConsciente === false) {
            acumulado.gastosPorImpulso += transacao.valor;
          }
        }

        return acumulado;
      },
      { receitas: 0, despesas: 0, gastosPorImpulso: 0 },
    );

    const metricas: MetricasFinanceiras = {
      saldoTotal: this.arredondarMoeda(totais.receitas - totais.despesas),
      totalDespesas: this.arredondarMoeda(totais.despesas),
      totalGastoImpulso: this.arredondarMoeda(totais.gastosPorImpulso),
    };

    return { historico, metricas };
  }

  private arredondarMoeda(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}
