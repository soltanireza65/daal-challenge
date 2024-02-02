import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { UpdateBalanceDTO } from './dto/update-balance.dto';
import { WalletDto } from './dto/wallet.dto';
import { Serialize } from '@app/common/interceptors/serializer.interceptor';

@Controller("wallet")
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get("balance/:user_id")
  @Serialize(WalletDto)
  getUserBalance(@Param('user_id') user_id: string) {
    return this.walletService.getUserBalance(+user_id);
  }

  @Post('money')
  updateBallance(@Body() body: UpdateBalanceDTO) {
    return this.walletService.updateBallance(body.user_id, body.amount);
  }
}
