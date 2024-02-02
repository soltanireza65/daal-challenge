import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UpdateBalanceDTO } from './dtos/update-balance.dto';


@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get("balance/:user_id")
  getUserBalance(@Param('user_id') user_id: string) {
    return this.walletService.getUserBalance(+user_id);
  }

  @Post('money')
  updateBallance(@Body() body: UpdateBalanceDTO) {
    return this.walletService.updateBallance(body.user_id, body.amount);
  }
}
