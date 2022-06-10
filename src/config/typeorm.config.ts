import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MusicDetailEntity } from 'src/music-chart-database/music-detail.entity';
import { MusicSummaryEntity } from 'src/music-chart-database/music-summary.entity';

//TODO get type, databasename .. from env
export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'musicChart.db',
  synchronize: true,
  entities: [MusicSummaryEntity, MusicDetailEntity],
};
