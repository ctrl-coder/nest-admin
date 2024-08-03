import { Global, Module, Provider } from '@nestjs/common';
import { ServerConfigService } from './services/config.service';

const providers: Provider[] = [ServerConfigService];

@Global()
@Module({
  providers,
  imports: [],
  exports: [...providers],
})
export class SharedModule {}
