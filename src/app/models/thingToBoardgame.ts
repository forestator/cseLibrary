import {BoardGame, Thing} from './boardGame.model';

export class ThingToBoardgame {
  static convertGameDetailsThingToBoardGame(ludoGame: BoardGame, boardGameWithDetails: Thing | null): BoardGame {
    if (boardGameWithDetails) {
      const elements = boardGameWithDetails.elements;
      return {
        ...ludoGame,
        thumbnail: this.getAttributeFirstElementText(elements, 'thumbnail') ?? '',
        fullImage: this.getAttributeFirstElementText(elements, 'image') ?? '',
        description: this.getAttributeFirstElementText(elements, 'description'),
        // @ts-ignore
        yearPublished: +this.getAttributeValue(elements, 'yearpublished'),
        // @ts-ignore
        minPlayers: +this.getAttributeValue(elements, 'minplayers'),
        // @ts-ignore
        maxPlayers: +this.getAttributeValue(elements, 'maxplayers'),
        // @ts-ignore
        playingTime: +this.getAttributeValue(elements, 'playingtime'),
        // @ts-ignore
        minAge: +this.getAttributeValue(elements, 'minage'),
        suggestedPlayAge: this.getSuggestedPlayAge(elements),
        // @ts-ignore
        themes: this.getAllAttributesOfType(elements, 'boardgamecategory')
      };
    } else {
      return ludoGame;
    }
  }

  static getAttributeValue(elements: Thing[], attribute: string): string | undefined {
    return elements.find(el => el.name === attribute)?.attributes.value;
  }

  static getAttributeFirstElementText(elements: Thing[], attribute: string): string | undefined {
    let text = elements.find(el => el.name === attribute)?.elements[0]?.text;
    if (attribute === 'description') {
      text = text?.split('&#10;&#10;').join('<br>').split('&mdash;').join('-').split('&quot;').join('"');
    }
    return text;
  }

  static getSuggestedPlayAge(elements: Thing[]): number | undefined {
    const result = this.getAttributeTopPollResult(elements, 'suggested_playerage');
    return result ? +result : undefined;
  }

  static getAttributeTopPollResult(elements: Thing[], attribute: string): string | undefined {
    const poll = elements.find(el => el.name === 'poll' && el.attributes.name === attribute);
    let maxResult: string | undefined = undefined;
    if (poll?.attributes?.totalvotes && +poll.attributes.totalvotes > 0) {
      let maxNumVote = 0;
      poll.elements[0].elements.forEach(el => {
        if (el.attributes.numvotes && +el.attributes.numvotes > maxNumVote) {
          maxNumVote = +el.attributes.numvotes;
          maxResult = el.attributes.value;
        }
      });
    }
    return maxResult;
  }

  static getAllAttributesOfType(elements: Thing[], attribute: string): Array<string | undefined> {
    return elements.filter(el => el.attributes?.type === attribute).map(el => el.attributes.value);
  }
}
