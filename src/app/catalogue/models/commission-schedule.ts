import moment, {Moment} from 'moment';

export function nextBricolageOpening(): Moment {
  const currentDate = moment();
  if (currentDate.day() === 0) {
    currentDate.day(1);
  } else if (currentDate.day() !== 1) {
    currentDate.day(1);
    currentDate.add(1, 'week');
  }
  return currentDate;
}

export interface CommissionSession {
  start: Moment;
  end: Moment;
}

interface WeeklySlot {
  /** ISO weekday: 1 = Monday ... 7 = Sunday. */
  isoWeekday: number;
  start: string;
  end: string;
}

/** The ludotheque is open every other week, on Tuesday at lunch and on Thursday early afternoon. */
const LUDOTHEQUE_SLOTS: ReadonlyArray<WeeklySlot> = [
  {isoWeekday: 2, start: '12:00', end: '12:30'},
  {isoWeekday: 4, start: '13:30', end: '14:00'},
];

// Counting weeks from a fixed open Monday keeps the alternation right across year boundaries,
// unlike the week-of-year number, which restarts every January.
const LUDOTHEQUE_OPEN_WEEK = '2026-11-09';
const WEEKS_TO_LOOK_AHEAD = 4;

function timeOn(day: Moment, time: string): Moment {
  const [hours, minutes] = time.split(':').map(Number);
  return day.clone().hour(hours).minute(minutes).second(0).millisecond(0);
}

/** First ludotheque session not yet over at `now` (a session in progress is still the current one). */
export function nextLudothequeSession(now: Moment = moment()): CommissionSession {
  const openMonday = moment(LUDOTHEQUE_OPEN_WEEK);
  const thisMonday = now.clone().startOf('isoWeek');
  for (let offset = 0; offset <= WEEKS_TO_LOOK_AHEAD; offset++) {
    const monday = thisMonday.clone().add(offset, 'weeks');
    // Rounded, because a daylight-saving change makes a week 167 or 169 hours long.
    const weeksSinceOpen = Math.round(monday.diff(openMonday, 'days') / 7);
    if (weeksSinceOpen % 2 !== 0) {
      continue;
    }
    for (const slot of LUDOTHEQUE_SLOTS) {
      const day = monday.clone().isoWeekday(slot.isoWeekday);
      const session = {start: timeOn(day, slot.start), end: timeOn(day, slot.end)};
      if (session.end.isAfter(now)) {
        return session;
      }
    }
  }
  throw new Error('No ludotheque session found in the coming weeks');
}

function hourLabel(time: Moment): string {
  return time.minutes() === 0 ? time.format('H[h]') : time.format('H[h]mm');
}

/** "mardi 17 novembre", for sessions whose hours are not published. */
export function dayLabel(day: Moment): string {
  return day.clone().locale('fr').format('dddd D MMMM');
}

/** "mardi 17 novembre, 12h – 12h30". */
export function sessionLabel(session: CommissionSession): string {
  return `${dayLabel(session.start)}, ${hourLabel(session.start)} – ${hourLabel(session.end)}`;
}
