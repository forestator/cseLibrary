import moment from 'moment';
import {dayLabel, nextBricolageSession, nextLibrarySession, nextLudothequeSession, sessionLabel} from './commission-schedule';

describe('nextLudothequeSession', () => {
  const next = (date: string) => nextLudothequeSession(moment(date));
  const format = (date: string) => next(date).start.format('ddd YYYY-MM-DD HH:mm');

  it('picks Tuesday lunch on an open week before it starts', () => {
    expect(format('2026-11-10T09:00')).toBe('Tue 2026-11-10 12:00');
  });

  it('moves on to Thursday once Tuesday session is over', () => {
    expect(format('2026-11-10T12:45')).toBe('Thu 2026-11-12 13:30');
  });

  it('keeps a session in progress as the current one', () => {
    expect(format('2026-11-12T13:45')).toBe('Thu 2026-11-12 13:30');
  });

  it('skips the closed week after the Thursday session', () => {
    expect(format('2026-11-12T14:30')).toBe('Tue 2026-11-24 12:00');
  });

  it('skips the closed week from its first day', () => {
    expect(format('2026-11-16T08:00')).toBe('Tue 2026-11-24 12:00');
  });

  it('keeps alternating across the new year', () => {
    expect(format('2026-12-24T15:00')).toBe('Tue 2027-01-05 12:00');
  });

  it('survives the daylight-saving change', () => {
    expect(format('2027-03-25T15:00')).toBe('Tue 2027-03-30 12:00');
  });

  it('labels the session in French with its hours', () => {
    expect(sessionLabel(next('2026-11-10T09:00'))).toBe('mardi 10 novembre, 12h – 12h30');
    expect(sessionLabel(next('2026-11-12T09:00'))).toBe('jeudi 12 novembre, 13h30 – 14h');
  });
});

describe('dayLabel', () => {
  it('writes the weekday and the day in French', () => {
    expect(dayLabel(moment('2026-11-16'))).toBe('lundi 16 novembre');
  });
});

describe('nextLibrarySession', () => {
  const label = (date: string) => sessionLabel(nextLibrarySession(moment(date)));

  it('opens Monday at lunch', () => {
    expect(label('2026-11-16T09:00')).toBe('lundi 16 novembre, 12h – 12h30');
  });

  it('goes to Thursday once Monday is over, and from Tuesday or Wednesday', () => {
    expect(label('2026-11-16T12:45')).toBe('jeudi 19 novembre, 13h30 – 14h');
    expect(label('2026-11-17T09:00')).toBe('jeudi 19 novembre, 13h30 – 14h');
  });

  it('comes back to Monday after the Thursday session, every week', () => {
    expect(label('2026-11-19T14:30')).toBe('lundi 23 novembre, 12h – 12h30');
    expect(label('2026-11-14T10:00')).toBe('lundi 16 novembre, 12h – 12h30');
  });
});

describe('nextBricolageSession', () => {
  const label = (date: string) => sessionLabel(nextBricolageSession(moment(date)));

  it('opens every Monday at lunch', () => {
    expect(label('2026-11-16T09:00')).toBe('lundi 16 novembre, 12h – 12h30');
  });

  it('waits for the next Monday once the session is over', () => {
    expect(label('2026-11-16T13:00')).toBe('lundi 23 novembre, 12h – 12h30');
    expect(label('2026-11-12T10:00')).toBe('lundi 16 novembre, 12h – 12h30');
  });
});
