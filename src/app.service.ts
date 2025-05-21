import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Hello, Welcome to Cube Movies API!',
    };
  }
}
