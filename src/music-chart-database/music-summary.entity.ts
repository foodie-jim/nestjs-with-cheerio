import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MusicChartType } from 'src/music-chart/music-chart-type.enum';
import { MusicDetailEntity } from './music-detail.entity';

@Entity()
export class MusicSummaryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  musicChartType: MusicChartType;

  @Column()
  ranking: number;

  @Column()
  name: string;

  @Column()
  singer: string;

  @Column()
  album: string;

  @ManyToOne(
    () => MusicDetailEntity,
    (musicDetailEntity) => musicDetailEntity.summaries,
  )
  detail: MusicDetailEntity;
}
