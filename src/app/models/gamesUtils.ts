import {BoardGame, BoardGameCategory, Thing} from './boardGame.model';
import {Consoles, VideoGame} from './videoGames.model';
import {BddGame, BorrowInfo, Game} from './common.model';
import {BorrowStatus} from './users.model';
import moment, {Moment} from 'moment';

export class GamesUtils {
  static convertGameDetailsThingToBoardGame(ludoGame: BoardGame, boardGameWithDetails: Thing | null): BoardGame {
    if (boardGameWithDetails) {
      const elements = boardGameWithDetails.elements;
      return {
        ...ludoGame,
        cover: ludoGame?.cover ?? this.getAttributeFirstElementText(elements, 'image'),
        description: ludoGame?.description ?? this.getAttributeFirstElementText(elements, 'description'),
        yearPublished: +this.getAttributeValue(elements, 'yearpublished'),
        minPlayers: +this.getAttributeValue(elements, 'minplayers'),
        maxPlayers: +this.getAttributeValue(elements, 'maxplayers'),
        playingTime: +this.getAttributeValue(elements, 'playingtime'),
        minAge: +this.getAttributeValue(elements, 'minage'),
        suggestedPlayAge: this.getSuggestedPlayAge(elements),
        themes: this.getAllAttributesOfType(elements, 'boardgamecategory')
      };
    } else {
      return ludoGame;
    }
  }

  static bddGameToLudoGame(bddGame: BddGame | null): Array<BoardGame | VideoGame | Game> {
    if (bddGame) {
      return Object.keys(bddGame).map(
        (key) => Object.assign({ref: key}, bddGame[key])
      );
    } else {
      return [];
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

  static libraryIdOfGame(game: Game | BorrowStatus): string | null {
    let library = null;
    if (('category' in game) && game.category in BoardGameCategory) {
      library = 'boardGames';
    }
    if (('category' in game) && game.category in Consoles) {
      library = 'videoGames';
    }
    if (('category' in game) && game.category === 'outsideGames') {
      library = 'outsideGames';
    }
    if ('libraryId' in game) {
      library = game.libraryId;
    }
    return library;
  }

  static gameIsReservedOrEmprunte(
    borrowList: Array<BorrowInfo>, date: Date, includeStartEndDates?: boolean): BorrowInfo | undefined {
    return borrowList.find(borrow => {
      const compareDate = moment(date, 'DD/MM/YYYY');
      const startDate = moment(borrow.startDate, 'DD/MM/YYYY');
      const endDate = moment(borrow.endDate, 'DD/MM/YYYY');
      if (includeStartEndDates) {
        return compareDate.isBetween(startDate, endDate) ||
          compareDate.isSame(startDate) ||
          compareDate.isSame(endDate);
      } else {
        return compareDate.isBetween(startDate, endDate) &&
          !(compareDate.isSame(startDate) && compareDate.isSame(endDate));
      }
    });
  }

  static reservedForNextSession(borrowList: Array<BorrowInfo>): boolean {
    return borrowList.some(borrow => {
      const nextSessionDay: Moment = this.getNextLudothequeOpening();
      return this.daysRemaining(borrow.startDate, nextSessionDay) < 14;
    });
  }

  private static daysRemaining(startDate: string, nextSessionDay: Moment): number {
    const startDateMoment: Moment = moment(startDate, 'DD/MM/YYYY');
    return nextSessionDay.diff(startDateMoment, 'days');
  }

  static getNextLudothequeOpening(): Moment {
    const currentDate: Moment = moment();
    if (currentDate.week() % 2 !== 0) {
      currentDate.add(1, 'week');
    }
    if (currentDate.week() % 2 === 0 && currentDate.day() > 4) {
      currentDate.day(2);
      currentDate.add(2, 'week');
    } else if (currentDate.day() !== 2 || currentDate.day() !== 4) {
      currentDate.day(currentDate.day() === 3 ? 4 : 2);
    }
    return currentDate;
  }
}
