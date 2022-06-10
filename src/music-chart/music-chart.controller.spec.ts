import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MusicChartDatabaseModule } from 'src/music-chart-database/music-chart-database.module';
import { MusicChartController } from './music-chart.controller';
import { MusicChartService } from './music-chart.service';
import { MusicChartType } from './music-chart-type.enum';

describe('MusicChartController', () => {
  let controller: MusicChartController;

  const mockMusicChartService = {
    getSongsByType: jest.fn(),
    getSummariesByType: jest.fn(),
    getSongByTypeId: jest.fn(),
  };

  const mockCache = {
    get: jest.fn(),
    set: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MusicChartDatabaseModule,
        CacheModule.register(),
        EventEmitterModule.forRoot(),
      ],
      controllers: [MusicChartController],
      providers: [
        {
          provide: MusicChartService,
          useValue: mockMusicChartService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCache,
        },
      ],
    }).compile();

    controller = module.get<MusicChartController>(MusicChartController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get Songs from cache', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue('cache data');
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSongsByType')
      .mockResolvedValue(null);

    const result = await controller.getSongs(MusicChartType.MELON);

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).not.toHaveBeenCalled();
    expect(result).toBe('cache data');
  });

  it('should get Songs from cache', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue('cache data');
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSongsByType')
      .mockResolvedValue(null);

    const result = await controller.getSongs(MusicChartType.MELON);

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).not.toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).not.toHaveBeenCalled();
    expect(result).toBe('cache data');
  });

  it('should get Songs from service', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue(false);
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSongsByType')
      .mockResolvedValue('service data');

    const result = await controller.getSongs(MusicChartType.MELON);

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).toHaveBeenCalled();
    expect(result).toBe('service data');
  });

  it('should get Summary from cache', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue('cache data');
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSummariesByType')
      .mockResolvedValue(null);

    const result = await controller.getSummaries(MusicChartType.MELON);

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).not.toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).not.toHaveBeenCalled();
    expect(result).toBe('cache data');
  });

  it('should get Summary from service', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue(false);
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSummariesByType')
      .mockResolvedValue('service data');

    const result = await controller.getSummaries(MusicChartType.MELON);

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).toHaveBeenCalled();
    expect(result).toBe('service data');
  });

  it('should get Song/Id from cache', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue('cache data');
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSongByTypeId')
      .mockResolvedValue(null);

    const result = await controller.getSongById(MusicChartType.MELON, 'id');

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).not.toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).not.toHaveBeenCalled();
    expect(result).toBe('cache data');
  });

  it('should get Song/Id from service', async () => {
    const cacheManagerGetSpy = jest
      .spyOn(mockCache, 'get')
      .mockResolvedValue(false);
    const cacheManagerSetSpy = jest
      .spyOn(mockCache, 'set')
      .mockResolvedValue(null);
    const serviceGetSummariesByTypeSpy = jest
      .spyOn(mockMusicChartService, 'getSongByTypeId')
      .mockResolvedValue('service data');

    const result = await controller.getSongById(MusicChartType.MELON, 'id');

    expect(cacheManagerGetSpy).toHaveBeenCalled();
    expect(cacheManagerSetSpy).toHaveBeenCalled();
    expect(serviceGetSummariesByTypeSpy).toHaveBeenCalled();
    expect(result).toBe('service data');
  });

  it('should reset cache', async () => {
    const cacheManagerResetSpy = jest
      .spyOn(mockCache, 'reset')
      .mockResolvedValue(null);
    await controller.handleDatabaseDeleted();
    expect(cacheManagerResetSpy).toHaveBeenCalled();
  });

  //TODO Add failed case
});
