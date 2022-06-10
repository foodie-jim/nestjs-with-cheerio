import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MusicChartDatabaseService } from 'src/music-chart-database/music-chart-database.service';
import { MusicChartScraper } from 'src/music-chart-scraper/music-chart-scraper.interface';
import { MusicDetail } from 'src/music-chart/music-detail.interface';
import { MusicSummary } from 'src/music-chart/music-summary.interface';
import { MusicChartType } from '../../music-chart/music-chart-type.enum';

@Injectable()
export class MelonMusicChartScraperService implements MusicChartScraper {
  constructor(
    private httpService: HttpService,
    private musicChartDatabaseService: MusicChartDatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  private logger = new Logger('MelonMusicChartScraperService');
  readonly chartType = MusicChartType.MELON;
  private called = 1;

  //@Cron(CronExpression.EVERY_30_SECONDS)
  @Cron(CronExpression.EVERY_30_MINUTES)
  async scrapSongs() {
    try {
      this.logger.log(
        `scrapSongs:${this.chartType} Started at ${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )}`,
      );

      const url = 'https://www.melon.com/chart/index.htm';
      const response = await firstValueFrom(this.httpService.get(url));

      await this.musicChartDatabaseService.deleteMusicSummariesByType(
        this.chartType,
      );
      await this.musicChartDatabaseService.deleteMusicDetilsByType(
        this.chartType,
      );
      this.eventEmitter.emit('music-chart.cache.deleted');

      const $ = cheerio.load(response.data, {
        ignoreWhitespace: true,
      });

      const tr = $('tbody tr');

      for (let i = 0; i < tr.length; ++i) {
        const tdList = $(tr[i]).children();

        const tdRank = $(tdList[1]).children();
        const divRank = $(tdRank[0]).children();
        const ranking = $(divRank[0]).text().trim();

        const tdName = $(tdList[5]).children();
        const divWrap = $(tdName[0]).children();
        const divWrapSongInfo = $(divWrap[0]).children();
        const divRank01 = $(divWrapSongInfo[0]).children();
        const spanName = $(divRank01[0]).children();
        const name = $(spanName).last().text().trim();

        const divRank02 = $(divWrapSongInfo[2]).children();
        const singer = $(divRank02[1]).children().text().trim();

        const tdAlbum = $(tdList[6]).children();
        const divAlbum = $(tdAlbum[0]).children();
        const divWrapAlbumInfo = $(divAlbum[0]).children();
        const divRank03 = $(divWrapAlbumInfo[0]).children();
        const aAlbum = $(divRank03[0]);
        const album = $(aAlbum).text().trim();
        const albumHref = $(aAlbum).attr('href');
        const albumId = albumHref.split("'")[1];

        const musicSummary: MusicSummary = {
          ranking: parseInt(ranking),
          name,
          singer,
          album,
        };

        const detailURL = `https://www.melon.com/album/detail.htm?albumId=${albumId}`;

        const detailResponse = await firstValueFrom(
          this.httpService.get(detailURL),
        );

        const $$ = cheerio.load(detailResponse.data, {
          ignoreWhitespace: true,
        });

        const list = $$('.section_info .list').children();
        const publisher = $$(list[5]).text().trim();
        const agency = $$(list[7]).text().trim();

        const musicDetail: MusicDetail = {
          publisher,
          agency,
        };

        const detailEntity =
          await this.musicChartDatabaseService.createMusicDetail(
            musicDetail,
            this.chartType,
            albumId,
          );

        await this.musicChartDatabaseService.createMusicSummary(
          musicSummary,
          this.chartType,
          detailEntity,
        );

        this.logger.verbose(
          `Scrap ${this.chartType}: ${JSON.stringify(
            musicSummary,
          )} ${JSON.stringify(musicDetail)} Done`,
        );
      }

      this.logger.log(
        `scrapSongs:${this.chartType} Done at ${moment().format(
          'YYYY-MM-DD HH:mm:ss',
        )}, ${this.called++} times called`,
      );
    } catch (e) {
      this.called = 1;
      this.logger.error(`Failed to scrap ${this.chartType} - ${e}`);
    }
  }
}
