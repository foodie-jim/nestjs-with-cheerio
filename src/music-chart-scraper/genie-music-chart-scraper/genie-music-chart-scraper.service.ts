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
export class GenieMusicChartScraperService implements MusicChartScraper {
  constructor(
    private httpService: HttpService,
    private musicChartDatabaseService: MusicChartDatabaseService,
    private eventEmitter: EventEmitter2,
  ) {}

  private logger = new Logger('GenieMusicChartScraperService');
  readonly chartType = MusicChartType.GENIE;
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

      const url = 'https://www.genie.co.kr/chart/top200';
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

        const tdRank = $(tdList[1]);
        const ranking = $(tdRank).text().split(' ')[0].trim();

        const tdName = $(tdList[4]).children();
        const nameArray = $(tdName[0]).text().split('19금');
        const name = nameArray[nameArray.length - 1].trim();
        const aArtist = $(tdName[1]);
        const aAlbum3 = $(tdName[3]).text().trim();
        const aAlbum4 = $(tdName[4]).text().trim();
        const singer = $(aArtist).text().trim();
        const album = aAlbum4 === '' ? aAlbum3 : aAlbum4;

        const aAlbumId3 = $(tdName[3]).attr('onclick');
        const aAlbumId4 = $(tdName[4]).attr('onclick');
        const albumIdOnClick = aAlbumId4 ? aAlbumId4 : aAlbumId3;
        const albumId = albumIdOnClick.match(/\d+/)[0];

        const musicSummary: MusicSummary = {
          ranking: parseInt(ranking),
          name,
          singer,
          album,
        };

        const detailURL = `https://www.genie.co.kr/detail/albumInfo?axnm=${albumId}`;

        const detailResponse = await firstValueFrom(
          this.httpService.get(detailURL),
        );

        const $$ = cheerio.load(detailResponse.data, {
          ignoreWhitespace: true,
        });

        const list = $$('.album-detail-infos .info-data').children();
        const publisher = $$(list[2]).text().trim();
        const agency = $$(list[3]).text().trim();

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
