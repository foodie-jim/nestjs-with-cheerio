import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MusicChartDatabaseService } from 'src/music-chart-database/music-chart-database.service';
import { VibeMusicChartScraperService } from './vibe-music-chart-scraper.service';

describe('VibeMusicChartScraperService', () => {
  let service: VibeMusicChartScraperService;
  let httpService: HttpService;
  let musicChartDatabaseService: MusicChartDatabaseService;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    httpService = new HttpService();
    musicChartDatabaseService = new MusicChartDatabaseService(null, null);
    eventEmitter = new EventEmitter2();

    service = new VibeMusicChartScraperService(
      httpService,
      musicChartDatabaseService,
      eventEmitter,
    );

    httpService.get = jest.fn().mockRejectedValue('');
    musicChartDatabaseService.deleteMusicSummariesByType = jest.fn();
    musicChartDatabaseService.deleteMusicDetilsByType = jest.fn();
    musicChartDatabaseService.createMusicDetail = jest.fn();
    musicChartDatabaseService.createMusicSummary = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
