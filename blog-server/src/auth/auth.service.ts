import {
  HttpException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new HttpException(
        {
          messgae: 'account or password is incorrect',
          status: 10001,
        },
        200,
      );
    }
    const payload = { sub: user.userId, username: user.username };
    const token = await this.jwtService.signAsync(payload);
    return {
      access_token: token,
      status: 200,
      avatar_url: user.avatar_url,
    };
  }
}
