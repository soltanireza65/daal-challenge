import { Expose } from "class-transformer"

export class AuditDto {
    @Expose() user_id: number
    @Expose() action: string
    @Expose() createdAt: string
    @Expose() updatedAt: string
}
