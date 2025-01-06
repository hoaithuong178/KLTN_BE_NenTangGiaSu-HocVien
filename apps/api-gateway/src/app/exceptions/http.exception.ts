import { ErrorDetail } from '@be/shared';
import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';

interface HttpExceptionCustom extends HttpException {
  statusCode: number;
  details: Array<ErrorDetail>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpExceptionCustom, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(JSON.stringify(exception));

    const status = exception.statusCode || exception.getStatus?.() || 500;
    const message = exception.message || 'Internal Server Error';
    const details = exception.details;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      ...(details && { details }),
    });
  }
}
