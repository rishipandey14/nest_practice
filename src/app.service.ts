import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        // throw new Error('Something went wrong');
        return 'Hello World!';
    }
}
