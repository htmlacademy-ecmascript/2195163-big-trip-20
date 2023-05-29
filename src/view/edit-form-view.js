import { WAYPOINT_OPTIONS, TRAVEL_WAYPOINTS } from '../const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { mapWaypoints, mapOptions } from '../mock/mocks.js';
import { humanizeDate } from '../utils.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const fillerData = {
  basePrice: '0',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: mapWaypoints.get('Tokyo'),
  isFavourite: false,
  offers: mapOptions.get(WAYPOINT_OPTIONS[0]),
  type: WAYPOINT_OPTIONS[0],
};

function createEditForm(data, isNew) {
  const { destination, offers, type, dateFrom, dateTo } = data;
  const pics =
    destination.pictures.length > 0
      ? `<div class="event__photos-container"><div class="event__photos-tape">
  ${destination.pictures.map(
    (elem) => `<img class="event__photo" src=${elem.src} alt="Event photo">`
  )}
  </div></div>`
      : '';
  const rollupBtn = `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>`;

  return /*html*/ `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>

    ${WAYPOINT_OPTIONS.map(
    (elem) => `<div class="event__type-item">
            <input id="event-type-${elem.toLocaleLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.toLocaleLowerCase()}">
            <label class="event__type-label  event__type-label--${elem.toLocaleLowerCase()}" for="event-type-${elem.toLocaleLowerCase()}-1">${elem}</label>
          </div>`
  ).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(
    `${destination.name}`
  )}" list="destination-list-1">
        <datalist id="destination-list-1">
        ${TRAVEL_WAYPOINTS.map((elem) => `<option value="${elem}"></option>`)}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value=${humanizeDate(
    dateFrom,
    'DD/MM/YY HH:mm'
  )}>
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value=${humanizeDate(
    dateTo,
    'DD/MM/YY HH:mm'
  )}>
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(
    ''
  )}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">${
  isNew ? 'Cancel' : 'Delete'
}</button>

      ${isNew ? '' : rollupBtn}
    </header>



    <section class="event__details">
      <section class="event__section  event__section--offers">

      ${
  offers.length > 0
    ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>'
    : ''
}

      ${
  offers &&
        `<div class="event__available-offers">${offers
          .map(
            (elem) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${elem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${elem.price}</span>
      </label>
    </div>`
          )
          .join('')}</div>`
}

      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>

        ${isNew ? pics : ''}

      </section>
    </section>
  </form>
</li>`;
}

export default class EditFormView extends AbstractStatefulView {
  #handleSubmit = null;
  #handleCancel = null;
  #datepickerTo = null;
  #datepickerFrom = null;
  #handleDelete = null;
  #isNew = false;

  constructor({
    waypoint = fillerData,
    onFormSubmit,
    onFormCancel,
    onFormDelete,
    isNew,
  }) {
    super();
    this._setState(EditFormView.parseWaypointToState(waypoint));
    this.#handleSubmit = onFormSubmit;
    this.#handleCancel = onFormCancel;
    this.#handleDelete = onFormDelete;
    this.#isNew = isNew;

    this._restoreHandlers();
  }

  get template() {
    return createEditForm(this._state, this.#isNew);
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.#handleSubmit(this._state);
  };

  #formCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCancel();
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDelete(EditFormView.parseWaypointToState(this._state));
  };

  #formEventChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #formDestChangeHandler = (evt) => {
    if (mapWaypoints.get(evt.target.value)) {
      this.updateElement({
        destination: mapWaypoints.get(evt.target.value),
      });
      this.element
        .querySelector('.event__save-btn')
        .removeAttribute('disabled', '');
    } else {
      this.element
        .querySelector('.event__save-btn')
        .setAttribute('disabled', '');
    }
  };

  #fromDateSubmitHandler = ([userDateFrom]) => {
    this.updateElement({
      dateFrom: userDateFrom,
    });
  };

  #toDateSubmitHandler = ([userDateTo]) => {
    this.updateElement({
      dateTo: userDateTo,
    });
  };

  #setDatepicker() {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,

          maxDate: this._state.dateTo,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#fromDateSubmitHandler,
        }
      );
    }
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,

          minDate: this._state.dateFrom,
          dateFormat: 'd/m/y H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#toDateSubmitHandler,
        }
      );
    }
  }

  _restoreHandlers() {
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formCancelHandler);
    }
    this.element
      .querySelector('.event__save-btn')
      .addEventListener('click', this.#formSubmitHandler);
    if (this.element.querySelector('.event__rollup-btn')) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteHandler);
    } else {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#formCancelHandler);
    }
    this.element
      .querySelector('.event__type-group')
      .addEventListener('click', this.#formEventChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#formDestChangeHandler);
    this.#setDatepicker();
  }

  reset(waypoint) {
    this.updateElement(EditFormView.parseWaypointToState(waypoint));
  }

  static parseWaypointToState(waypoint) {
    return { ...waypoint };
  }
}
