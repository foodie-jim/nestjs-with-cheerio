import { BadRequestException, PipeTransform } from '@nestjs/common';
import { MusicChartType } from '../music-chart-type.enum';

export class MusicChartTypeValidationPipe implements PipeTransform {
  readonly typeOptions = [
    MusicChartType.MELON.toUpperCase(),
    MusicChartType.GENIE.toUpperCase(),
    MusicChartType.VIBE.toUpperCase(),
  ];

  transform(value: any) {
    const upperValue = value.toUpperCase();

    if (!this.isStatusValid(upperValue)) {
      throw new BadRequestException(
        `${upperValue} isn't in the status options`,
      );
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.typeOptions.indexOf(status);
    return index !== -1;
  }
}
