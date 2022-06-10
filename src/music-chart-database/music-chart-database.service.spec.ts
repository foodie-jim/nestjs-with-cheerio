import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MusicChartType } from 'src/music-chart/music-chart-type.enum';
import { MusicDetail } from 'src/music-chart/music-detail.interface';
import { MusicSummary } from 'src/music-chart/music-summary.interface';
import { MusicChartDatabaseService } from './music-chart-database.service';
import { MusicDetailEntity } from './music-detail.entity';
import { MusicSummaryEntity } from './music-summary.entity';

describe('MusicChartDatabaseService', () => {
  let service: MusicChartDatabaseService;
  let musicSummary: MusicSummary;
  let musicDetail: MusicDetail;
  let musicChartType: MusicChartType;
  let detailEntity: MusicDetailEntity;
  let summaryEntity: MusicSummaryEntity;

  const mockMusicSummaryRepository = {
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockMusicDetailRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MusicChartDatabaseService,
        {
          provide: getRepositoryToken(MusicSummaryEntity),
          useValue: mockMusicSummaryRepository,
        },
        {
          provide: getRepositoryToken(MusicDetailEntity),
          useValue: mockMusicDetailRepository,
        },
      ],
    }).compile();

    service = module.get<MusicChartDatabaseService>(MusicChartDatabaseService);

    musicSummary = {
      ranking: 1,
      name: 'name',
      singer: 'singer',
      album: 'album',
    };
    musicDetail = {
      publisher: 'publisher',
      agency: 'agency',
    };
    musicChartType = MusicChartType.MELON;
    detailEntity = {
      musicChartType: MusicChartType.MELON,
      id: 'id',
      publisher: 'publisher',
      agency: 'agency',
      summaries: [],
    };
    summaryEntity = {
      id: 'uuid',
      musicChartType: MusicChartType.MELON,
      ranking: 1,
      name: 'name',
      singer: 'singer',
      album: 'album',
      detail: detailEntity,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create MusicSummary', async () => {
    const saveMock = jest
      .spyOn(mockMusicSummaryRepository, 'save')
      .mockResolvedValue(null);

    const result = await service.createMusicSummary(
      musicSummary,
      musicChartType,
      detailEntity,
    );

    expect(saveMock).toHaveBeenCalled();
    expect(result.ranking).toBe(1);
    expect(result.detail.publisher).toBe('publisher');
  });

  it('fail to create MusicDetail because it is already exist', async () => {
    const saveMock = jest
      .spyOn(mockMusicDetailRepository, 'save')
      .mockResolvedValue(null);

    const findOneMock = jest
      .spyOn(mockMusicDetailRepository, 'findOne')
      .mockResolvedValue({
        agency: 'agencyTest',
        id: 'albumIdTest',
      });

    const result = await service.createMusicDetail(
      musicDetail,
      musicChartType,
      'albumId',
    );

    expect(findOneMock).toHaveBeenCalled();
    expect(saveMock).not.toHaveBeenCalled();
    expect(result.agency).toBe('agencyTest');
    expect(result.id).toBe('albumIdTest');
  });

  it('should create MusicDetail if a record is not exist', async () => {
    const saveMock = jest
      .spyOn(mockMusicDetailRepository, 'save')
      .mockResolvedValue(null);

    const findOneMock = jest
      .spyOn(mockMusicDetailRepository, 'findOne')
      .mockResolvedValue(false);

    const result = await service.createMusicDetail(
      musicDetail,
      musicChartType,
      'albumId',
    );

    expect(findOneMock).toHaveBeenCalled();
    expect(saveMock).toHaveBeenCalled();
    expect(result.agency).toBe('agency');
    expect(result.id).toBe('albumId');
  });

  it('should delete MusicSummary', async () => {
    const deleteMock = jest
      .spyOn(mockMusicSummaryRepository, 'delete')
      .mockResolvedValue(null);

    await service.deleteMusicSummariesByType(musicChartType);

    expect(deleteMock).toHaveBeenCalled();
  });

  it('should delete MusicDetail', async () => {
    const deleteMock = jest
      .spyOn(mockMusicDetailRepository, 'delete')
      .mockResolvedValue(null);

    await service.deleteMusicDetilsByType(musicChartType);

    expect(deleteMock).toHaveBeenCalled();
  });
});
