import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MusicChartType } from './music-chart-type.enum';
import { MusicChartService } from './music-chart.service';
import { MusicChartTypeValidationPipe } from './pipes/music-chart-type-validation.pipe';
import { Cache } from 'cache-manager';

@Controller('music-chart/:vendor')
export class MusicChartController {
  constructor(
    private musicChartService: MusicChartService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private logger = new Logger('MusicChartController');

  @Get('/songs')
  async getSongs(
    @Param('vendor', MusicChartTypeValidationPipe) vendor: MusicChartType,
  ) {
    const requestKey = `music-chart/${vendor}/songs`;
    const cachedValue = await this.cacheManager.get(requestKey);
    if (cachedValue) {
      this.logger.log(`Request ${requestKey}, return cached value`);
      return cachedValue;
    } else {
      const value = await this.musicChartService.getSongsByType(vendor);
      await this.cacheManager.set(requestKey, value);
      this.logger.log(
        `Request ${requestKey}, set value to cache, return value`,
      );
      return value;
    }
  }

  @Get('/summary')
  async getSummaries(
    @Param('vendor', MusicChartTypeValidationPipe) vendor: MusicChartType,
  ) {
    const requestKey = `music-chart/${vendor}/summary`;
    const cachedValue = await this.cacheManager.get(requestKey);
    if (cachedValue) {
      this.logger.log(`Request ${requestKey}, return cached value`);
      return cachedValue;
    } else {
      const value = await this.musicChartService.getSummariesByType(vendor);
      await this.cacheManager.set(requestKey, value);
      this.logger.log(
        `Request ${requestKey}, set value to cache, return value`,
      );
      return value;
    }
  }

  @Get('/song/:musicId')
  async getSongById(
    @Param('vendor', MusicChartTypeValidationPipe) vendor: MusicChartType,
    @Param('musicId', new ParseUUIDPipe()) musicId,
  ) {
    const requestKey = `music-chart/${vendor}/song/${musicId}`;
    const cachedValue = await this.cacheManager.get(requestKey);
    if (cachedValue) {
      this.logger.log(`Request ${requestKey}, return cached value`);
      return cachedValue;
    } else {
      const value = await this.musicChartService.getSongByTypeId(
        vendor,
        musicId,
      );
      await this.cacheManager.set(requestKey, value);
      this.logger.log(
        `Request ${requestKey}, set value to cache, return value`,
      );
      return value;
    }
  }

  @OnEvent('music-chart.cache.deleted')
  async handleDatabaseDeleted() {
    await this.cacheManager.reset();
    this.logger.log('Reset cache done');
  }
}
