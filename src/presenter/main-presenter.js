import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';

export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;

  constructor({ tripMain, tripControlsFiltres, tripEventsSection }) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;
  }

  init() {
    render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
    render(
      new TripFiltersView(),
      this.#tripControlsFilters,
      RenderPosition.AFTERBEGIN
    );
    render(new TripSortView(), this.#tripEventsSection);
  }
}
