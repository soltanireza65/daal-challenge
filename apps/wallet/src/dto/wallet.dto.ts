import { Expose } from "class-transformer"

export class WalletDto {
    @Expose() user_id: number
    @Expose() balance: number
    // @Expose() createdAt: string
    // @Expose() updatedAt: string
}
