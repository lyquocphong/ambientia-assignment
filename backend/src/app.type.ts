import { Service } from '@/entities';
import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export class AppConfig {
  @ApiResponseProperty()
  service: Service;

  @ApiResponseProperty()
  timezone: string;
}

export class ErrorResponse {
  @ApiProperty({ example: 400, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ example: 'Bad Request', description: 'Error message' })
  message: string;

  @ApiProperty({
    example: 'Validation failed',
    description: 'Error details (optional)',
  })
  error?: string;

  constructor(statusCode: number, message: string, error?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
  }
}
