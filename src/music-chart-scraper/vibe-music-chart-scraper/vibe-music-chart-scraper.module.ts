import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MusicChartDatabaseModule } from 'src/music-chart-database/music-chart-database.module';
import { VibeMusicChartScraperService } from './vibe-music-chart-scraper.service';

@Module({
  imports: [
    HttpModule,
    MusicChartDatabaseModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [VibeMusicChartScraperService],
})
export class VibeMusicChartScraperModule {}
