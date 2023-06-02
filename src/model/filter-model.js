import Observable from '../framework/observable';
import { FiltersType } from '../const';

export default class FilterModel extends Observable {
  #filter = FiltersType.EVERYTHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, newFilter) {
    this.#filter = newFilter;
    this._notify(updateType, newFilter);
  }
}
