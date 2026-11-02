import { Model } from 'mongoose';
import { Transacao } from '../src/transacoes/schemas/transacao.schema';
import { TransacoesService } from '../src/transacoes/transacoes.service';

describe('TransacoesService', () => {
  let service: TransacoesService;
  let model: { find: jest.Mock };

  beforeEach(() => {
    model = { find: jest.fn() };
    service = new TransacoesService(model as unknown as Model<Transacao>);
  });

  it('calcula saldo, despesas e gastos por impulso', async () => {
    const historico = [
      { descricao: 'Salário', valor: 3000, tipo: 'receita', categoria: 'Renda', consumoConsciente: true },
      { descricao: 'Aluguel', valor: 1000, tipo: 'despesa', categoria: 'Moradia', consumoConsciente: true },
      { descricao: 'Delivery', valor: 80.5, tipo: 'despesa', categoria: 'Alimentação', consumoConsciente: false },
    ];

    model.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(historico) }),
    });

    const resultado = await service.findAll();

    expect(resultado.historico).toHaveLength(3);
    expect(resultado.metricas).toEqual({
      saldoTotal: 1919.5,
      totalDespesas: 1080.5,
      totalGastoImpulso: 80.5,
    });
  });

  it('retorna métricas zeradas quando não há transações', async () => {
    model.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
    });

    const resultado = await service.findAll();

    expect(resultado).toEqual({
      historico: [],
      metricas: {
        saldoTotal: 0,
        totalDespesas: 0,
        totalGastoImpulso: 0,
      },
    });
  });
});
