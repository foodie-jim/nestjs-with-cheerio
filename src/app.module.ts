import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MusicChartModule } from './music-chart/music-chart.module';
import { MelonMusicChartScraperModule } from './music-chart-scraper/melon-music-chart-scraper/melon-music-chart-scraper.module';
import { MusicChartDatabaseModule } from './music-chart-database/music-chart-database.module';
import { GenieMusicChartScraperModule } from './music-chart-scraper/genie-music-chart-scraper/genie-music-chart-scraper.module';
import { VibeMusicChartScraperModule } from './music-chart-scraper/vibe-music-chart-scraper/vibe-music-chart-scraper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./configs/${process.env.NODE_ENV}.env`,
    }),
    MusicChartModule,
    MelonMusicChartScraperModule,
    MusicChartDatabaseModule,
    GenieMusicChartScraperModule,
    VibeMusicChartScraperModule,
  ],
})
export class AppModule {}
