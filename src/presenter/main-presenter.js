import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
import WaypointPresenter from './waypoint-presenter.js';

export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;

  #waypointModel = '';
  #waypoints = [];

  constructor({
    tripMain,
    tripControlsFiltres,
    tripEventsSection,
    waypointModel,
    waypoints,
  }) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsSection = tripEventsSection;
    this.#waypoints = waypoints;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#waypoints = [...this.#waypointModel.points];
    const waypointPresenter = new WaypointPresenter({
      waypointContainer: this.#tripEventsSection,
      waypointModel: this.#waypointModel,
    });
    render(
      new TripFiltersView(this.#waypoints),
      this.#tripControlsFilters,
      RenderPosition.AFTERBEGIN
    );
    if (this.#waypoints.length !== 0) {
      render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
      render(new TripSortView(), this.#tripEventsSection);
    }
    waypointPresenter.init();
  }
}
