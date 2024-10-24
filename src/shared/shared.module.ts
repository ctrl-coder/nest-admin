import { Global, Module, Provider } from '@nestjs/common';
import { ServerConfigService } from './services/config.service';
import { RedisService } from './services/redis.service';

const providers: Provider[] = [ServerConfigService, RedisService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
