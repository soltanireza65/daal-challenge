import { IsNumber } from 'class-validator'

export class UpdateBalanceDTO {

    @IsNumber()
    user_id: number

    @IsNumber()
    amount: number
}