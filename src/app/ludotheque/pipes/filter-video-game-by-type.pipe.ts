import {Pipe, PipeTransform} from '@angular/core';
import {VideoGame, VideoGameType} from '../../models/videoGames.model';

@Pipe({
  name: 'filterVideoGameByType'
})
export class FilterVideoGameByTypePipe implements PipeTransform {

  transform(value: VideoGame[], type: VideoGameType): VideoGame[] {
    return value.filter(game => game?.type === type);
  }

}
