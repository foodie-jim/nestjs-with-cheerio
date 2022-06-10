import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';
import { MusicChartDatabaseService } from 'src/music-chart-database/music-chart-database.service';
import { GenieMusicChartScraperService } from './genie-music-chart-scraper.service';
import { MusicChartDatabaseModule } from 'src/music-chart-database/music-chart-database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

describe('GenieMusicChartScraperService', () => {
  let service: GenieMusicChartScraperService;
  let httpService: HttpService;
  let musicChartDatabaseService: MusicChartDatabaseService;
  let eventEmitter: EventEmitter2;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockDatabaseService = {
    deleteMusicSummariesByType: jest.fn(),
    deleteMusicDetilsByType: jest.fn(),
    createMusicDetail: jest.fn(),
    createMusicSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        MusicChartDatabaseModule,
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
      ],
      providers: [
        GenieMusicChartScraperService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: MusicChartDatabaseService,
          useValue: mockDatabaseService,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<GenieMusicChartScraperService>(
      GenieMusicChartScraperService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  xit('should scrap songs', () => {
    const filePaht = path.join(__dirname, '/test/music-chart.html');
    const htmlFile = fs.readFileSync(filePaht).toString();
    const response: AxiosResponse = {
      data: htmlFile,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const getMock = jest
      .spyOn(mockHttpService, 'get')
      .mockImplementation(() => of(response));

    service.scrapSongs();

    expect(getMock).toHaveBeenCalled();
  });
});
