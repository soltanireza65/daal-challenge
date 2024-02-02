import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, plainToInstance } from 'class-transformer';
import { AuditDto } from 'apps/audit/src/dtos/audit.dto';

const d = [{
  "_id": "65bce530f8f04a3c357a0d48",
  "user_id": 1,
  "action": "WALLET:DEPOSIT",
  "createdAt": "2024-02-02T12:47:26.132Z",
  "updatedAt": "2024-02-02T12:47:26.132Z",
  "__v": 0
}]

interface ClassConstructor {
  new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      map((data: any) => {
        
        const mapped = plainToInstance(this.dto, data, {
          excludeExtraneousValues: true
        });

        return mapped
      }),
    );
  }
}
