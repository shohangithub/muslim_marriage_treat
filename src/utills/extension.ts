import { format, isValid, parseISO } from 'date-fns';
import dayjs from 'dayjs';

export type UnitTypeLongPlural =
  | 'milliseconds'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'months'
  | 'years'
  | 'dates';

export class Utils {
  static formattedDateRange(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      // console.error('Invalid input dates:', { startDate, endDate });
      return 'Invalid dates';
    }
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) {
      // console.error('Parsed dates are invalid:', { start, end });
      return 'Invalid dates';
    }

    const startMonthDay = format(start, 'MMMM d');
    const endMonthDay = format(end, 'MMMM d');
    const year = format(start, 'yyyy');

    return `${startMonthDay} - ${endMonthDay}, ${year}`;
  }

  static formattedDate(dateString: string) {
    if (!dateString) {
      // console.error('Invalid input date:', { dateString });
      return 'Invalid date';
    }

    const date = parseISO(dateString);

    if (!isValid(date)) {
      // console.error('Parsed date is invalid:', { date });
      return 'Invalid date';
    }

    const monthDay = format(date, 'MMMM d');
    const year = format(date, 'yyyy');

    return `${monthDay}, ${year}`;
  }

  static dateDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const date1 = new Date(a);
    const date2 = new Date(b);
    const utc1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
    );
    const utc2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
    );

    return Math.floor((utc2 - utc1) / _MS_PER_DAY) + 1;
  }

  static getWeekDays(a, b) {
    const start = new Date(a);
    const end = new Date(b);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const weekDays:string[]=[];
    let loop = new Date(start);
    while (loop <= end) {
      weekDays.push(days[loop.getDay()]);
      const newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return weekDays;
  }

  static getDays(a, b) {
    const start = new Date(a);
    const end = new Date(b);

    const weekDays:string[]=[];
    let loop = new Date(start);
    while (loop <= end) {
      
      weekDays.push(this.formattedDate(loop.toISOString().split('T')[0]));
      const newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return weekDays;
  }

  static getExpireTime(expireTime) {
    return new Date(
      new Date().setMinutes(new Date().getMinutes() + parseInt(expireTime)),
    )
      .getTime()
      .toString();
  }
}

export const dateDiffInDays = (
  date1: string,
  date2: string,
  unit?: UnitTypeLongPlural,
) => {
  return Math.ceil(dayjs(date1).diff(date2, unit, true));
};
