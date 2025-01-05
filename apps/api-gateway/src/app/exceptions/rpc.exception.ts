import { ErrorDetail } from '@be/shared';
import { Catch, Injectable, Logger, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

interface RpcExceptionCustom extends RpcException {
  statusCode: number;
  details: Array<ErrorDetail>;
}

interface ResponseError {
  statusCode: number;
  timestamp: string;
  message: string;
  details: Array<ErrorDetail>;
}

@Catch()
@Injectable()
export class CustomRpcExceptionFilter implements RpcExceptionFilter {
  private readonly logger = new Logger(CustomRpcExceptionFilter.name);

  catch(exception: RpcExceptionCustom): Observable<ResponseError> {
    this.logger.error(JSON.stringify(exception));

    return throwError(() => ({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      message: exception.message || 'An error occurred',
      details: exception.details,
    }));
  }
}
