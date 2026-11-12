import {Pipe, PipeTransform} from '@angular/core';

const SPECIAL_LABELS: Readonly<Record<string, string>> = {
  switch: 'Switch',
  switch2: 'Switch 2',
  ps4: 'PS4',
  ps5: 'PS5',
  xboxOne: 'Xbox One',
  xboxX: 'Xbox Series X',
  wii: 'Wii',
  ps3: 'PS3',
  xbox360: 'Xbox 360',
  ds: 'Nintendo DS',
  ds3: 'Nintendo 3DS',
  ps2: 'PS2',
  psp: 'PSP',
  psVita: 'PS Vita',
  strategie: 'Stratégie',
  enquete: 'Enquête',
};

/** Human readable name of a board game category or of a console, from its technical id. */
export function categoryLabel(category: string): string {
  return SPECIAL_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}

@Pipe({name: 'gameCategoryLabel'})
export class GameCategoryLabelPipe implements PipeTransform {
  transform(category: string): string {
    return categoryLabel(category);
  }
}
