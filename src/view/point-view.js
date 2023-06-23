import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';
import { getTimeDiff } from '../time.js';
import { getById, toUpperCaseFirstLetter } from '../utils.js';

const createOffersListTemplate = (point, availableOffers) =>
  point.offers
    .map((offer) => {
      offer = getById(offer, availableOffers);
      return `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>
  `;
    })
    .join('');

const createPointTemplate = (point, offers, destinations) => {
  const { eventType, destinationId, isFavorite, dateFrom, dateTo, basePrice } =
    point;
  const destination = getById(destinationId, destinations);
  const availableOffers = offers.find(
    (currentOffers) => currentOffers.type === point.eventType
  ).offers;
  const offersPointTemplate = createOffersListTemplate(point, availableOffers);

  const timeDiff = getTimeDiff(dateFrom, dateTo);

  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="${dayjs(dateFrom).format(
    'YYYY-MM-DD'
  )}">${dayjs(dateFrom).format('MMM D')}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${toUpperCaseFirstLetter(eventType)} ${
  destination.name
}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${dayjs(
    dateFrom
  ).toISOString()}">${dayjs(dateFrom).format('HH:mm')}</time>
        &mdash;
        <time class="event__end-time" datetime="${dayjs(
    dateTo
  ).toISOString()}">${dayjs(dateTo).format('HH:mm')}</time>
      </p>
      <p class="event__duration">${timeDiff}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offersPointTemplate}
    </ul>
    <button class="event__favorite-btn ${
  isFavorite ? 'event__favorite-btn--active' : ''
}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};

export default class PointView extends AbstractView {
  #point = null;
  #offers = [];
  #destinations = [];
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({ point, onEditClick, onFavoriteClick, offers, destinations }) {
    super();
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#offers, this.#destinations);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
