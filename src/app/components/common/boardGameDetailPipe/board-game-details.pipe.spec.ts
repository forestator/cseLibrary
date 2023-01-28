import { BoardGameDetailsPipe } from './board-game-details.pipe';

describe('BoardGameDetailsPipe', () => {
  it('create an instance', () => {
    const pipe = new BoardGameDetailsPipe();
    expect(pipe).toBeTruthy();
  });
});
