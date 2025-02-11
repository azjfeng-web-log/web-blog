import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>,
    @Res() res: any,
    @Request() req: any,
  ) {
    const result = await this.authService.signIn(
      signInDto.username,
      signInDto.password,
    );
    res.cookie('token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
    res.cookie('account', signInDto.username, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
    res.cookie('avatar_url', result.avatar_url, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000,
    });
    res.json(result);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res() res: any, @Request() req: any) {
    res.clearCookie('token');
    res.json({ message: 'Logout success', status: 401 });
  }

  @UseGuards(AuthGuard)
  @Post('profile')
  getProfile(@Body() body: any,  @Request() req) {
    return req.user;
  }
}
