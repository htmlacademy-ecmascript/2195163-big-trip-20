import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, count } = filter;

  return `<div class="trip-filters__filter">
              <input
                id="filter-${type}"
                class="trip-filters__filter-input  visually-hidden"
                type="radio"
                name="trip-filter"
                value="${type}"
                ${type === currentFilterType ? 'checked' : ''}
                ${count === 0 ? 'disabled' : ''}
                >
                <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
            </div>`;
};

const createFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
  ${filterItemsTemplate}
  </form>`;
};

export default class FiltersView extends AbstractView {
  #currentFilter = null;
  #handleFilterTypeChange = null;
  #filters = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();

    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
