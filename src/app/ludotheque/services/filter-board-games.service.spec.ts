import {TestBed} from '@angular/core/testing';
import {FilterBoardGamesService} from './filter-board-games.service';
import {BoardGame} from '../../models/boardGame.model';

describe('FilterBoardGamesService', () => {
  let service: FilterBoardGamesService;
  const game = {
    ref: 'ludo1', name: 'Test', category: 'duo', id: '1', weight: '100',
    minPlayers: 2, maxPlayers: 4, playingTime: 20, minAge: 8, suggestedPlayAge: 10
  } as BoardGame;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterBoardGamesService);
  });

  it('counts the active filters', () => {
    expect(service.activeCount()).toBe(0);
    service.filter.set({age: '10', duration: null, nbPlayers: '2'});
    expect(service.activeCount()).toBe(2);
  });

  it('accepts every game when no filter is set', () => {
    expect(service.matches(game)).toBeTrue();
  });

  it('filters on the suggested age first, then on the minimum age', () => {
    expect(service.matches(game, {age: '10'})).toBeTrue();
    expect(service.matches(game, {age: '9'})).toBeFalse();
    expect(service.matches({...game, suggestedPlayAge: undefined}, {age: '8'})).toBeTrue();
  });

  it('filters on the duration range', () => {
    expect(service.matches(game, {duration: '15>30'})).toBeTrue();
    expect(service.matches(game, {duration: '>60'})).toBeFalse();
  });

  it('filters on the number of players', () => {
    expect(service.matches(game, {nbPlayers: '3'})).toBeTrue();
    expect(service.matches(game, {nbPlayers: '5'})).toBeFalse();
    expect(service.matches(game, {nbPlayers: '8+'})).toBeFalse();
  });
});
