import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeDate, humanizeDuration } from '../utils.js';

const HOURS_MINS = 'HH:mm';
const DAYS_MONTH = 'MMM DD';

const createWaypointElement = (data) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isFavourite,
  } = data;
  const offersModelInfo = offers;

  const offersList = offersModelInfo.length
    ? offersModelInfo
      .map(
        (elem) => /*html*/ `<li class="event__offer">
    <span class="event__offer-title">${elem.title}</span>
    &plus;&euro;
    <span class="event__offer-price">${elem.price}</span>
  </li>`
      )
      .join('')
    : '';

  return /*html*/ `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${humanizeDate(
    dateFrom,
    DAYS_MONTH
  )}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination.name}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="2019-03-18T10:30">${humanizeDate(
    dateFrom,
    HOURS_MINS
  )}</time>
        &mdash;
        <time class="event__end-time" datetime="2019-03-18T11:00">${humanizeDate(
    dateTo,
    HOURS_MINS
  )}</time>
      </p>
      <p class="event__duration">${humanizeDuration(dateFrom, dateTo)}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
     ${offersList}
    </ul>
    <button class="event__favorite-btn ${
  isFavourite ? 'event__favorite-btn--active' : ''
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

export default class WaypointView extends AbstractStatefulView {
  #onEditClick = null;
  #handleFavourite = null;
  constructor({ waypoint, onEditClick, handleFavourite }) {
    super();

    this._setState(waypoint);
    this.#onEditClick = onEditClick;
    this.#handleFavourite = handleFavourite;

    this._restoreHandlers();
  }

  get template() {
    return createWaypointElement(this._state);
  }

  _restoreHandlers() {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#onClickEvt);

    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', this.#onFavEvt);
  }

  #onClickEvt = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #onFavEvt = () => {
    this.#handleFavourite();
  };

  static parseWaypointToState(waypoint) {
    return waypoint;
  }
}
