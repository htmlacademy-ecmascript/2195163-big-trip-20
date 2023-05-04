import { createElement } from '../render.js';
import { WAYPOINT_OPTIONS } from '../const.js';


function createEditForm(data) {

  const { destination, offers,type} = data;

  return /*html*/`<li class="trip-events__item">
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

    ${WAYPOINT_OPTIONS.map((elem) => `<div class="event__type-item">
            <input id="event-type-${elem.toLocaleLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${elem.toLocaleLowerCase()}">
            <label class="event__type-label  event__type-label--${elem.toLocaleLowerCase()}" for="event-type-${elem.toLocaleLowerCase()}-1">${elem}</label>
          </div>`).join('')}

          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">

      ${offers.length > 0 ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}

      ${offers && `<div class="event__available-offers">${offers.map((elem) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${elem.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${elem.price}</span>
      </label>
    </div>`).join('')}</div>`}

      </section>

      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description}</p>


    ${destination.pictures.length > 0
    ? `<div class="event__photos-container"><div class="event__photos-tape">
    ${destination.pictures.map((elem) => `<img class="event__photo" src=${elem.src} alt="Event photo">`)}
    </div></div>`
    : ''}

      </section>
    </section>
  </form>
</li>`;
}

export default class EditFormView {
  constructor ({waypoint}) {
    this.waypoint = waypoint;
  }

  getTemplate() {
    return createEditForm(this.waypoint);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
