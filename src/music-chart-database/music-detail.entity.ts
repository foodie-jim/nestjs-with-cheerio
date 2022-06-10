import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MusicChartType } from 'src/music-chart/music-chart-type.enum';
import { MusicSummaryEntity } from './music-summary.entity';

@Entity()
export class MusicDetailEntity {
  @Column()
  musicChartType: MusicChartType;

  @PrimaryColumn()
  id: string;

  @Column()
  publisher: string;

  @Column()
  agency: string;

  @OneToMany(
    () => MusicSummaryEntity,
    (musicSummaryEntity) => musicSummaryEntity.detail,
  )
  summaries: MusicSummaryEntity[];
}
