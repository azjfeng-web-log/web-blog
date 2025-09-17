import { UsersConfig } from '@src/modules/users/users.entity';
import { BlogsConfig } from '@src/modules/blogs/blogs.entity';
import { CommentsConfig } from '@src/modules/comments/comments.entity';

function getDataBase(envName: string): string {
  switch (envName) {
    case 'prod-env':
    case 'prod':
      return 'blog_prod';
    case 'local':
      return 'blog_dev';
    default:
      return 'blog_test';
  }
}

export const dbConfig: any =  {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'wc8294WCY',
  database: getDataBase(process.env.CODING_ENV_NAME || ''),
  entities: [UsersConfig, BlogsConfig, CommentsConfig],
  synchronize: true,
};
