import { DateTime } from 'luxon';

export function formatDate(date: string): DateTime {
    return DateTime.fromISO(new Date(date).toISOString()).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
}

export function isoDate(date: string): DateTime {
    return DateTime.fromISO(new Date(date).toISOString()).toISO();
}
