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
