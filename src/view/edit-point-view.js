import dayjs from 'dayjs';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  getById,
  toUpperCaseFirstLetter,
  getValueFromString,
} from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import 'flatpickr/dist/themes/material_blue.css';

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const BLANK_POINT = {
  eventType: 'flight',
  dateFrom: '',
  dateTo: '',
  basePrice: 0,
  offers: [],
};

const createOffersListTemplate = (point = BLANK_POINT) =>
  point.availableOffers
    .map((availableOffer) => {
      const { offers: pickedOffers } = point;
      const checked = pickedOffers.includes(availableOffer.id) ? 'checked' : '';
      return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${getValueFromString(availableOffer.title)}"
      type="checkbox"
      name="event-offer-${point.eventType}"
      value="${availableOffer.title}"
      ${checked}>
      <label class="event__offer-label" for="event-offer-${getValueFromString(
    availableOffer.title
  )}">
        <span class="event__offer-title">${availableOffer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${availableOffer.price}</span>
      </label>
    </div>
    `;
    })
    .join('');

const createOffersTemplate = (point) => {
  const offersListTemplate = createOffersListTemplate(point);
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersListTemplate}
      </div>
    </section>
  `;
};

const createPhotosTapeTemplate = (pictures) =>
  pictures
    .map(
      (picture) =>
        `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`
    )
    .join('');

const createDestinationInfoTemplate = (destinationInfo) => {
  const { description, pictures } = destinationInfo;
  const photosTapeTemplate = createPhotosTapeTemplate(pictures);
  return `<section class="event__details">
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${photosTapeTemplate}
          </div>
        </div>
      </section>
    </section>`;
};

const createEventTypesTemplate = (currentType) =>
  TYPES.map(
    (eventType) => `<div class="event__type-item">
    <input
    id="event-type-${eventType}"
    class="event__type-input  visually-hidden"
    type="radio"
    name="event-type"
    value="${eventType}"
    ${eventType === currentType ? 'checked' : ''}>
    <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}">
    ${toUpperCaseFirstLetter(eventType)}
    </label>
  </div>`
  ).join('');

const createDestinationListTemplate = (destinations) =>
  destinations
    .map((destination) => `<option value="${destination.name}"></option>`)
    .join('');

const createEditPointTemplate = (point, offers, destinations) => {
  const {
    eventType,
    dateFrom,
    dateTo,
    destinationId,
    basePrice,
    availableOffers,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const offersTemplate =
    availableOffers.length !== 0 ? createOffersTemplate(point) : '';
  const destinationInfo = getById(destinationId, destinations);
  const destinationsListTemplate = createDestinationListTemplate(destinations);
  const destinationTemplate =
    destinationId !== undefined
      ? createDestinationInfoTemplate(destinationInfo)
      : '';
  const eventTypesTemplate = createEventTypesTemplate(eventType);
  const isNewPoint = !point.id;
  const templateButtons = isNewPoint
    ? `<button class="event__reset-btn" type="reset" ${
      isDisabled ? 'disabled' : ''
    }>Cancel</button>`
    : `<button class="event__reset-btn" type="reset" ${
      isDisabled ? 'disabled' : ''
    }>${
      isDeleting ? 'Deleting...' : 'Delete'
    }</button> \n <button class="event__rollup-btn" type="button">`;

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${
  isDisabled ? 'disabled' : ''
}>

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypesTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${toUpperCaseFirstLetter(eventType)}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${
  destinationId !== undefined ? destinationInfo.name : ''
}" list="destination-list-1" autocomplete="off"  ${
  isDisabled ? 'disabled' : ''
} required>
        <datalist id="destination-list-1">
          ${destinationsListTemplate}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time"
               id="event-start-time-1"
               type="text"
               name="event-start-time"
               value="${
  dateFrom ? dayjs(dateFrom).format('DD/MM/YY HH:mm') : ''
}"
               ${isDisabled ? 'disabled' : ''}
               autocomplete="off"
               required>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time"
               id="event-end-time-1"
               type="text"
               name="event-end-time"
               value="${dateTo ? dayjs(dateTo).format('DD/MM/YY HH:mm') : ''}"
               ${isDisabled ? 'disabled' : ''}
               autocomplete="off"
               required>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden"></span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" min="1" name="event-price" value="${basePrice}" ${
  isDisabled ? 'disabled' : ''
}>
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit" ${
  isDisabled ? 'disabled' : ''
}>${isSaving ? 'Saving...' : 'Save'}</button>
      ${templateButtons}

        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
          ${offersTemplate}
      </section>
    ${destinationTemplate};
  </form>
</li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #offers = [];
  #destinations = [];

  #handleFormSubmit = null;
  #handleRollupClick = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    point = BLANK_POINT,
    offers,
    destinations,
    onFormSubmit,
    onRollupClick,
    onDeleteClick,
  }) {
    super();

    this.#offers = offers;
    this.#destinations = destinations;

    this._setState(EditPointView.parsePointToState(point), {
      availableOffers: [],
    });

    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupClick = onRollupClick;
    this.#handleDeleteClick = onDeleteClick;

    this.#updateAvailableOffers(this.#offers);
    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(
      this._state,
      this.#offers,
      this.#destinations
    );
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  reset = (point) => {
    this.updateElement(EditPointView.parsePointToState(point));
  };

  _restoreHandlers() {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    const rollUpButton = this.element.querySelector('.event__rollup-btn');
    if (rollUpButton) {
      rollUpButton.addEventListener('click', this.#rollupClickHandler);
    }
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeClickHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('input', this.#priceChangeHandler);
    if (this._state.availableOffers.length !== 0) {
      this.element
        .querySelector('.event__section--offers')
        .addEventListener('change', this.#offerChangeHandler);
    }
    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #setDatepickerFrom = () => {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateFromChangeHandler,
      }
    );
  };

  #setDatepickerTo = () => {
    this.#datepickerTo = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onClose: this.#dateToChangeHandler,
      }
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value,
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #updateAvailableOffers = (availableOffers) => {
    const suitableType = this.#offers.find(
      (offer) => offer.type === this._state.eventType
    );
    availableOffers = suitableType.offers;

    this._setState({ availableOffers });

    return availableOffers;
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #destinationChangeHandler = (evt) => {
    const currentCityInfo = this.#destinations.find(
      (destination) => destination.name === evt.target.value
    );

    if (currentCityInfo === undefined) {
      return;
    }

    this.updateElement({
      destinationId: currentCityInfo.id,
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #eventTypeClickHandler = (evt) => {
    evt.preventDefault();
    const newEventType = evt.target.innerHTML.toLowerCase().trim();
    const offers = [];
    this._setState({ eventType: newEventType });
    const availableOffers = this.#updateAvailableOffers();
    this.updateElement({
      eventType: newEventType.toLowerCase(),
      offers,
      availableOffers,
    });
  };

  #offerChangeHandler = (evt) => {
    evt.preventDefault();
    if (!evt.target.classList.contains('event__offer-checkbox')) {
      return;
    }

    const pickedOffer = this._state.availableOffers.find(
      (offer) => offer.title === evt.target.value
    );
    const isChecked = evt.target.checked;
    const offers = this._state.offers;
    if (isChecked) {
      offers.push(pickedOffer.id);
    } else {
      const element = offers.find((offerId) => offerId === pickedOffer.id);
      const index = offers.indexOf(element);
      offers.splice(index, 1);
    }
    this._setState({ offers });
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    delete point.availableOffers;

    return point;
  };
}
