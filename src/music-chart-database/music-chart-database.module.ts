import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from 'src/config/typeorm.config';
import { MusicChartDatabaseService } from './music-chart-database.service';
import { MusicDetailEntity } from './music-detail.entity';
import { MusicSummaryEntity } from './music-summary.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    TypeOrmModule.forFeature([MusicSummaryEntity, MusicDetailEntity]),
  ],
  providers: [MusicChartDatabaseService],
  exports: [MusicChartDatabaseService],
})
export class MusicChartDatabaseModule {}
