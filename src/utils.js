import dayjs from 'dayjs';
import { FiltersType } from './const';

const ZERO = 0;

const humanizeDate = (anyDate, dateFormat) =>
  anyDate ? dayjs(anyDate).format(dateFormat) : '';

const countDates = (dateFrom, dateTo) => {
  const daysDiff = dayjs(dateTo).diff(dayjs(dateFrom), 'day', true);
  const days = Math.floor(daysDiff);
  const hoursDiff = dayjs(dateTo).diff(dayjs(dateFrom), 'hour', true);
  const hoursAll = Math.floor(hoursDiff);
  const hours = Math.floor((daysDiff - days) * 24);
  const minutes = Math.floor((hoursDiff - hoursAll) * 60);
  if (days === 0 && hours === 0) {
    return `${minutes}M`;
  }
  if (days === 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${days}D ${hours}H ${minutes}M`;
};

const getRandomElem = (arr) => arr[Math.floor(Math.random() * arr.length)];


function getWeight(optionA, optionB) {
  if (optionA === null && optionB === null) {
    return 0;
  }

  if (optionA === null) {
    return 1;
  }

  if (optionB === null) {
    return -1;
  }

  return null;
}

function sortWaypointsByDate(waypA, waypB) {
  const weight = getWeight(waypA.dateFrom, waypB.dateFrom);

  return weight ?? dayjs(waypA.dateFrom).diff(dayjs(waypB.dateFrom));
}

function sortWaypointsByTime(waypA, waypB) {
  const weight = getWeight(waypA.dateFrom, waypB.dateFrom);

  return (
    weight ??
    dayjs(waypB.dateTo).diff(dayjs(waypB.dateFrom)) -
      dayjs(waypA.dateTo).diff(dayjs(waypA.dateFrom))
  );
}

function sortWaypointsByPrice(waypA, waypB) {
  return waypB.basePrice - waypA.basePrice;
}

function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

const filter = {
  [FiltersType.EVERYTHING]: (events) => events,
  [FiltersType.FUTURE]: (events) =>
    events.filter(
      (oneEvent) => dayjs(oneEvent.dateFrom).diff(new Date()) > ZERO
    ),
  [FiltersType.PRESENT]: (events) =>
    events.filter(
      (oneEvent) =>
        dayjs(oneEvent.dateFrom).diff(new Date()) <= ZERO &&
        dayjs(oneEvent.dateTo).diff(new Date()) >= ZERO
    ),
  [FiltersType.PAST]: (events) =>
    events.filter((oneEvent) => dayjs(oneEvent.dateTo).diff(new Date()) < ZERO),
};

export {
  getRandomElem,
  humanizeDate,
  countDates,
  getWeight,
  sortWaypointsByDate,
  sortWaypointsByTime,
  sortWaypointsByPrice,
  isDatesEqual,
  filter,
};
