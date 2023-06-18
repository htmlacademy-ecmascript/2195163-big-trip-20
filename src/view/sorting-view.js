import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../const.js';

const createTripSort = (currentSortType) =>
/*html*/ `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  <div class="trip-sort__item  trip-sort__item--day">
    <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day" checked>
    <label class="trip-sort__btn" data-sort-type="${
  SortType.DAY
}" for="sort-day">Day</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--event">
    <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
    <label class="trip-sort__btn" data-sort-type="${
  SortType.EVENT
}" for="sort-event">Event</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--time">
    <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${
  currentSortType === SortType.TIME ? 'checked' : ''
}>
    <label class="trip-sort__btn" data-sort-type="${
  SortType.TIME
}" for="sort-time">Time</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--price">
    <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${
  currentSortType === SortType.PRICE ? 'checked' : ''
}>
    <label class="trip-sort__btn" data-sort-type="${
  SortType.PRICE
}" for="sort-price">Price</label>
  </div>

  <div class="trip-sort__item  trip-sort__item--offer">
    <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
    <label class="trip-sort__btn" data-sort-type="${
  SortType.OFFERS
}" for="sort-offer">Offers</label>
  </div>
</form>`;
export default class TripSortView extends AbstractView {
  #handleSortTypeChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSortType = currentSortType;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createTripSort(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'LABEL') {
      return;
    }
    if (
      evt.target.dataset.sortType === SortType.EVENT ||
      evt.target.dataset.sortType === SortType.OFFERS
    ) {
      return;
    }

    this.#handleSortTypeChange(evt.target.dataset.sortType);
  };
}
