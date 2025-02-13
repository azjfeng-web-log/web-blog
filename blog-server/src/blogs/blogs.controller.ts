import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@src/auth/auth.guard';
import { BlogsService } from './blogs.service';
import { Public } from '@src/auth/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @UseGuards(AuthGuard)
  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createBlog(@Body() body: any) {
    try {
        const result = await this.blogsService.create(body);
        return {
            status: 0,
            message: 'success',
            data: result
        };
    } catch (error) {
        return {
            status: 10001,
            message: error.message
        }   
    }
  }
}
