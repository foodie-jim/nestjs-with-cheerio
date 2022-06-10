import { MusicChartType } from '../music-chart/music-chart-type.enum';

export interface MusicChartScraper {
  chartType: MusicChartType;
  scrapSongs(): void;
}
