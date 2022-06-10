import { Test, TestingModule } from '@nestjs/testing';
import { MusicChartDatabaseModule } from 'src/music-chart-database/music-chart-database.module';
import { MusicChartType } from './music-chart-type.enum';
import { MusicChartService } from './music-chart.service';

describe('MusicChartService', () => {
  let service: MusicChartService;

  const mockService = {
    getSongsByType: jest.fn(),
    getSummariesByType: jest.fn(),
    getSongByTypeId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MusicChartDatabaseModule],
      providers: [
        {
          provide: MusicChartService,
          useValue: mockService,
        },
      ],
    }).compile();

    service = module.get<MusicChartService>(MusicChartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call getSongsByType', () => {
    const getSongsByTypeSpy = jest
      .spyOn(mockService, 'getSongsByType')
      .mockResolvedValue(null);
    service.getSongsByType(MusicChartType.MELON);
    expect(getSongsByTypeSpy).toHaveBeenCalled();
  });

  it('should call getSummariesByType', () => {
    const getSummariesByTypeSpy = jest
      .spyOn(mockService, 'getSummariesByType')
      .mockResolvedValue(null);
    service.getSummariesByType(MusicChartType.MELON);
    expect(getSummariesByTypeSpy).toHaveBeenCalled();
  });

  it('should call getSongByTypeId', () => {
    const getSongByTypeIdSpy = jest
      .spyOn(mockService, 'getSongByTypeId')
      .mockResolvedValue(null);
    service.getSongByTypeId(MusicChartType.MELON, 'id');
    expect(getSongByTypeIdSpy).toHaveBeenCalled();
  });

  //TODO Add failed case
});
