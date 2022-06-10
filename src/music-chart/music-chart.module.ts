import { CacheModule, Module } from '@nestjs/common';
import { MusicChartService } from './music-chart.service';
import { MusicChartController } from './music-chart.controller';
import { MusicChartDatabaseModule } from 'src/music-chart-database/music-chart-database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    MusicChartDatabaseModule,
    CacheModule.register(),
    EventEmitterModule.forRoot(),
  ],
  controllers: [MusicChartController],
  providers: [MusicChartService],
})
export class MusicChartModule {}
