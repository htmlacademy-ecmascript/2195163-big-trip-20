import dayjs from 'dayjs';
import { getTimeDiff } from './time.js';

const getById = (searchedId, list) =>
  list.find((currentElement) => currentElement.id === searchedId);

const getByType = (searchedType, offersList) => {
  const initializedOffers = offersList.find(
    (currentOffers) => currentOffers.type === searchedType.eventType
  );
  return initializedOffers.offers;
};

const toUpperCaseFirstLetter = (word) =>
  `${word.slice(0, 1).toUpperCase()}${word.slice(1)}`;
const getValueFromString = (string) =>
  string.toLowerCase().replaceAll(' ', '-');
const sortDay = (firstPoint, secondPoint) => {
  const firstPointDate = dayjs(firstPoint.dateFrom);
  const secondPointDate = dayjs(secondPoint.dateFrom);
  return firstPointDate.valueOf() - secondPointDate.valueOf();
};
const sortTime = (pointA, pointB) =>
  getTimeDiff(pointB.dateFrom, pointB.dateTo, false) -
  getTimeDiff(pointA.dateFrom, pointA.dateTo, false);
const sortPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const isDatesEqual = (dateA, dateB) =>
  (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB);

const isPointPast = ({ dateFrom, dateTo }) =>
  dayjs().isAfter(dayjs(dateFrom)) && dayjs().isAfter(dayjs(dateTo));
const isPointPresent = ({ dateFrom, dateTo }) =>
  dayjs().isAfter(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo));
const isPointFuture = ({ dateFrom, dateTo }) =>
  dayjs().isBefore(dayjs(dateFrom)) && dayjs().isBefore(dayjs(dateTo));

export {
  sortDay,
  sortTime,
  sortPrice,
  getById,
  getByType,
  isDatesEqual,
  isPointPast,
  isPointPresent,
  isPointFuture,
  toUpperCaseFirstLetter,
  getValueFromString,
};
