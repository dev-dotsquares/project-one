import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'HPBS Product Knowledge Hub API - v1.0';
  }
}
