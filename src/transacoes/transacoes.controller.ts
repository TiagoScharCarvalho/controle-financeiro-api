import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTransacaoDto } from './dto/create-transacao.dto';
import { TransacoesService } from './transacoes.service';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  create(@Body() dados: CreateTransacaoDto) {
    return this.transacoesService.create(dados);
  }

  @Get()
  findAll() {
    return this.transacoesService.findAll();
  }
}
