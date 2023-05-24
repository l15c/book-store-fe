import { format, getTime, formatDistanceToNow } from 'date-fns';
import moment from 'moment';

// ----------------------------------------------------------------------

type InputValue = Date | string | number | null;

export function fDate(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date: InputValue, newFormat?: string) {
  const fm = newFormat || 'dd/MM/yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTimeRange(startDate: InputValue, endDate: InputValue, newFormat?: string) {
  const sameDate = moment(startDate).isSame(moment(endDate), 'date');
  if (!sameDate) return `${fDateTime(startDate)} - ${fDateTime(endDate)}`;
  return `${fDate(startDate)} (${fDate(startDate, 'HH:mm')} - ${fDate(endDate, 'HH:mm')})`;
}

export function fTimestampDate(date: InputValue) {
  return date ? getTime(new Date(date).setHours(0, 0, 0, 0)) : '';
}

export function fTimestamp(date: InputValue) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date: InputValue) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
