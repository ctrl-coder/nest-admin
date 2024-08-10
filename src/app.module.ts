import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { SharedModule } from './shared/shared.module';
import { ServerConfigService } from './shared/services/config.service';

import { UserModule, AuthModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      // name: 'micro-shop', // 如果未为连接设置任何 name ，则该连接的名称将设置为 default。请注意，不应该有多个没有名称或同名的连接，否则它们会被覆盖，注意区分数据库config.name字段
      useFactory: (configService: ServerConfigService) =>
        configService.postgresConfig,
      inject: [ServerConfigService],
      dataSourceFactory: (options) => {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return Promise.resolve(
          addTransactionalDataSource(new DataSource(options)),
        );
      },
    }),
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
