import dayjs from 'dayjs';


const humanizeDate = (anyDate, dateFormat) => anyDate ? dayjs(anyDate).format(dateFormat) : '';

const countDates = (dateFrom, dateTo) =>{
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

export {getRandomElem, humanizeDate, countDates};
