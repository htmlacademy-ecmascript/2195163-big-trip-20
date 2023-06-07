import AbstractView from '../framework/view/abstract-view.js';
import { FILTERS_OPTIONS } from '../const.js';
import { filter } from '../utils.js';

function createTripFiltersElement({ currentFilter, model }) {
  const filtersList = FILTERS_OPTIONS.map(
    (elem) => /*html*/ `<div class="trip-filters__filter">
      <input
        id="filter-${elem}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        ${filter[elem](model.points).length ? '' : 'disabled'}
        ${elem === currentFilter ? 'checked' : ''}
        name="trip-filter"
        value="${elem}"
      />
      <label class="trip-filters__filter-label" for="filter-${elem}">
        ${elem}
      </label>
    </div>`
  ).join('');

  return /*html*/ `<form class="trip-filters" action="#" method="get">
      ${filtersList}
      <button class="visually-hidden" type="submit">
        Accept filter
      </button>
    </form>`;
}

export default class TripFiltersView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleChangeFilter = null;
  #waypointModel = null;

  constructor({
    filters,
    currentFilterType,
    onFilterTypeChange,
    waypointModel,
  }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleChangeFilter = onFilterTypeChange;
    this.#waypointModel = waypointModel;

    this.element.addEventListener('change', (evt) => {
      if (evt.target.tagName === 'INPUT') {
        this.#handleChangeFilter(evt.target.value);
      }
    });
  }

  get template() {
    return createTripFiltersElement({
      filters: this.#filters,
      currentFilter: this.#currentFilter,
      model: this.#waypointModel,
    });
  }
}
