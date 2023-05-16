import AbstractView from '../framework/view/abstract-view.js';
import { FILTERS_OPTIONS } from '../const.js';

function createTripFiltersElement(data) {
  const isEmpty = data.length === 0;

  return ` <form class="trip-filters" action="#" method="get">
  ${FILTERS_OPTIONS.map((elem) => {
    let isDisabled = false;
    if (elem === FILTERS_OPTIONS[1] || elem === FILTERS_OPTIONS[3]) {
      if (isEmpty) {
        isDisabled = true;
      }
    }
    return `<div class="trip-filters__filter">
      <input id="filter-${elem.toLocaleLowerCase()}" ${
  isDisabled && 'disabled'
} class="trip-filters__filter-input  visually-hidden"  type="radio" name="trip-filter" value="${elem.toLocaleLowerCase()} ${
  elem.toLocaleLowerCase === 'past' ? 'checked' : ''
}">
      <label class="trip-filters__filter-label" for="filter-${elem.toLocaleLowerCase()}">${elem}</label>
    </div>`;
  }).join('')}


  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
}

export default class TripFiltersView extends AbstractView {
  #filtersData = '';

  constructor(data) {
    super();
    this.#filtersData = data;
  }

  get template() {
    return createTripFiltersElement(this.#filtersData);
  }
}
