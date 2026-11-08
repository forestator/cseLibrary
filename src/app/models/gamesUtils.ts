import {BoardGame, BoardGameCategory, Thing} from './boardGame.model';
import {Consoles, VideoGame} from './videoGames.model';
import {BddGame, Game} from './common.model';
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
                suggestedPlayAge: this.getSuggestedPlayAge(elements) ?? +this.getAttributeValue(elements, 'minage'),
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
            ).sort((a, b) => {
                const extractNumericPart = (str: string): number | undefined => {
                    const numericPart = str.match(/\d+/);
                    return numericPart ? parseInt(numericPart[0], 10) : undefined;
                };
                const aRefNumeric = a.ref ? extractNumericPart(a.ref) : undefined;
                const bRefNumeric = b.ref ? extractNumericPart(b.ref) : undefined;

                if (aRefNumeric !== undefined && bRefNumeric !== undefined) {
                    return bRefNumeric - aRefNumeric;
                } else if (aRefNumeric !== undefined) {
                    return -1;
                } else if (bRefNumeric !== undefined) {
                    return 1;
                } else {
                    return 0;
                }
            });
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

    static libraryIdOfGame(game: Game): string | null {
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
        return library;
    }

    static getNextLudothequeOpening(): Moment {
        const currentDate: Moment = moment();
        if (currentDate.week() % 2 !== 0) {
            currentDate.day(2);
            currentDate.add(1, 'week');
        } else if (currentDate.week() % 2 === 0 && currentDate.day() > 4) {
            currentDate.day(2);
            currentDate.add(2, 'week');
        } else if (currentDate.day() !== 2 || currentDate.day() !== 4) {
            currentDate.day(currentDate.day() === 3 ? 4 : 2);
        }
        return currentDate;
    }
}
