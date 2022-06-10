import { Injectable } from '@nestjs/common';
import { MusicChartDatabaseService } from 'src/music-chart-database/music-chart-database.service';
import { MusicChartType } from 'src/music-chart/music-chart-type.enum';

@Injectable()
export class MusicChartService {
  constructor(private musicChartDatabaseService: MusicChartDatabaseService) {}

  getSongsByType(vendor: MusicChartType) {
    return this.musicChartDatabaseService.getSongsByType(vendor);
  }

  getSummariesByType(vendor: MusicChartType) {
    return this.musicChartDatabaseService.getSummariesByType(vendor);
  }

  getSongByTypeId(vendor: MusicChartType, musicId: string) {
    return this.musicChartDatabaseService.getSongByTypeId(vendor, musicId);
  }
}
