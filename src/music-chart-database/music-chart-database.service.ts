import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MusicChartType } from 'src/music-chart/music-chart-type.enum';
import { MusicDetail } from 'src/music-chart/music-detail.interface';
import { MusicSummary } from 'src/music-chart/music-summary.interface';
import { Repository } from 'typeorm';
import { MusicDetailEntity } from './music-detail.entity';
import { MusicSummaryEntity } from './music-summary.entity';

@Injectable()
export class MusicChartDatabaseService {
  constructor(
    @InjectRepository(MusicSummaryEntity)
    private readonly musicSummaryRepository: Repository<MusicSummaryEntity>,
    @InjectRepository(MusicDetailEntity)
    private readonly musicDetailRepository: Repository<MusicDetailEntity>,
  ) {}

  private logger = new Logger('MusicChartDatabaseService');

  async createMusicSummary(
    musicSummary: MusicSummary,
    musicChartType: MusicChartType,
    detailEntity: MusicDetailEntity,
  ) {
    try {
      const musicSummaryEntity = new MusicSummaryEntity();
      musicSummaryEntity.musicChartType = musicChartType;
      musicSummaryEntity.ranking = musicSummary.ranking;
      musicSummaryEntity.name = musicSummary.name;
      musicSummaryEntity.singer = musicSummary.singer;
      musicSummaryEntity.album = musicSummary.album;
      musicSummaryEntity.detail = detailEntity;

      await this.musicSummaryRepository.save(musicSummaryEntity);

      this.logger.verbose(
        `Created MusicSummary:${musicChartType} ${JSON.stringify(
          musicSummaryEntity,
        )}`,
      );

      return musicSummaryEntity;
    } catch (e) {
      this.logger.error(
        `Failed to createMusicSummary:${musicChartType} - ${e}`,
      );
    }
  }

  async createMusicDetail(
    musicDetail: MusicDetail,
    musicChartType: MusicChartType,
    albumId: string,
  ) {
    try {
      const musicDetailEntity = new MusicDetailEntity();
      musicDetailEntity.musicChartType = musicChartType;
      musicDetailEntity.id = albumId;
      musicDetailEntity.agency = musicDetail.agency;
      musicDetailEntity.publisher = musicDetail.publisher;

      const entity = await this.musicDetailRepository.findOne({
        where: {
          id: musicDetailEntity.id,
        },
      });

      if (entity) {
        return entity;
      } else {
        await this.musicDetailRepository.save(musicDetailEntity);

        this.logger.verbose(
          `Created MusicDetail:${musicChartType} ${JSON.stringify(
            musicDetailEntity,
          )}`,
        );
        return musicDetailEntity;
      }
    } catch (e) {
      this.logger.error(`Failed to createMusicDetail:${musicChartType} - ${e}`);
    }
  }

  async deleteMusicSummariesByType(musicChartType: MusicChartType) {
    try {
      await this.musicSummaryRepository.delete({
        musicChartType,
      });
      this.logger.verbose(`Deleted MusicSummariesByType:${musicChartType}`);
    } catch (e) {
      this.logger.error(`Failed to deleteMusicSummariesByType - ${e}`);
    }
  }

  async deleteMusicDetilsByType(musicChartType: MusicChartType) {
    try {
      await this.musicDetailRepository.delete({
        musicChartType,
      });
      this.logger.verbose(`Deleted MusicDetailsByType:${musicChartType}`);
    } catch (e) {
      this.logger.error(`Failed to deleteMusicDetilsByType - ${e}`);
    }
  }

  getSongByTypeId(musicChartType: MusicChartType, id: string) {
    try {
      return this.musicSummaryRepository
        .createQueryBuilder('s')
        .leftJoin('s.detail', 'd')
        .select([
          's.id',
          's.ranking',
          's.name',
          's.singer',
          's.album',
          'd.publisher',
          'd.agency',
        ])
        .where('s.musicChartType = :type', { type: musicChartType })
        .where('s.id = :id', { id: id })
        .getOne();
    } catch (e) {
      this.logger.error(`Failed to getSongsByType - ${e}`);
    }
  }

  getSummariesByType(musicChartType: MusicChartType) {
    try {
      return this.musicSummaryRepository.find({
        select: {
          id: true,
          musicChartType: false,
          ranking: true,
          name: true,
          singer: true,
          album: true,
        },
        where: {
          musicChartType: musicChartType,
        },
      });
    } catch (e) {
      this.logger.error(`Failed to getSummariesByType - ${e}`);
    }
  }

  getSongsByType(musicChartType: MusicChartType) {
    try {
      return this.musicSummaryRepository
        .createQueryBuilder('s')
        .leftJoin('s.detail', 'd')
        .select([
          's.id',
          's.ranking',
          's.name',
          's.singer',
          's.album',
          'd.publisher',
          'd.agency',
        ])
        .where('s.musicChartType = :type', { type: musicChartType })
        .getMany();
    } catch (e) {
      this.logger.error(`Failed to getSongsByType - ${e}`);
    }
  }
}
