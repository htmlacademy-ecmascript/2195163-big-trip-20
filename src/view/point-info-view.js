import AbstractView from '../framework/view/abstract-view.js';
import { getById, getByType } from '../utils.js';
import dayjs from 'dayjs';

const createTripInfoTitle = (points, destinations) => {
  const startPoint = getById(points[0].destinationId, destinations);
  const endPoint = getById(
    points[points.length - 1].destinationId,
    destinations
  );
  let middlePoint = null;

  switch (true) {
    case points.length === 1:
      return `<h1 class="trip-info__title">${startPoint.name}</h1>`;
    case points.length === 2:
      return `<h1 class="trip-info__title">${startPoint.name} &mdash; ${endPoint.name}</h1>`;
    case points.length === 3:
      middlePoint = getById(points[1].destinationId, destinations);
      return `<h1 class="trip-info__title">${startPoint.name} &mdash; ${middlePoint.name} &mdash; ${endPoint.name}</h1>`;
    case points.length > 3:
      return `<h1 class="trip-info__title">${startPoint.name} &mdash; ... &mdash; ${endPoint.name}</h1>`;
  }
};

const createTripInfoDates = (points) => {
  const isSameMonth =
    points[0].dateFrom.getMonth() ===
    points[points.length - 1].dateTo.getMonth();
  const isSameYear =
    points[0].dateFrom.getFullYear() ===
    points[points.length - 1].dateTo.getFullYear();
  const startDate = dayjs(points[0].dateFrom).format('MMM D');
  const endDate = dayjs(points[points.length - 1].dateTo).format(
    isSameMonth && isSameYear ? 'DD' : 'MMM D'
  );
  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`;
};

const calculateTripCost = (points, offers) => {
  points.forEach((point) => {
    let offersPrice = 0;
    point.offers.forEach((offer) => {
      const suitableOffers = getByType(point, offers);
      const initOffer = getById(offer, suitableOffers);
      offersPrice += initOffer.price;
      point.offersPrice = offersPrice;
    });
  });
  const tripCost = points.reduce(
    (sum, point) => sum + (point.basePrice + (point.offersPrice ?? 0)),
    0
  );
  points.forEach((point) => delete point.offersPrice);
  return tripCost;
};

const createPointInfoTemplate = (points, destinations, offers) => {
  const tripInfoTitle = createTripInfoTitle(points, destinations);
  const tripInfoDates = createTripInfoDates(points, destinations);
  const tripCost = calculateTripCost(points, offers);
  return `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${tripInfoTitle}
      ${tripInfoDates}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
    </p>
  </section>`;
};

export default class PointInfoView extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;
  constructor(points, offers, destinations) {
    super();
    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createPointInfoTemplate(
      this.#points,
      this.#destinations,
      this.#offers
    );
  }
}
