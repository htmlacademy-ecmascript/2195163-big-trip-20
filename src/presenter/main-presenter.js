import { render, RenderPosition } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';
import TripFiltersView from '../view/filters-view.js';
import TripSortView from '../view/sorting-view.js';
import WaypointPresenter from './waypoint-presenter.js';
import { SortType } from '../const.js';
import { sortWaypointsByTime, sortWaypointsByPrice } from '../utils.js';

export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsSection = null;
  #sortComponent = null;
  #currentSortType = SortType.DATE;

  #waypointModel = '';
  #waypoints = [];
  #sourcedWaypoints = [];
  #waypointsInst = null;

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
    this.#sourcedWaypoints = [...this.#waypointModel.points];

    render(
      new TripFiltersView(this.#waypoints),
      this.#tripControlsFilters,
      RenderPosition.AFTERBEGIN
    );
    if (this.#waypoints.length !== 0) {
      render(new TripInfoView(), this.#tripMain, RenderPosition.AFTERBEGIN);
      this.#renderSortOptions();
    }
    this.#renderWaypoints();
  }

  #renderWaypoints() {
    const waypointPresenter = new WaypointPresenter({
      waypointContainer: this.#tripEventsSection,
    });
    this.#waypointsInst = waypointPresenter;
    waypointPresenter.init(this.#waypoints);
  }

  #deleteWaypoints() {
    this.#waypointsInst.clearList();
  }

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripEventsSection);
  }

  #sortOptions(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#waypoints = [...this.#sourcedWaypoints];
        break;
      case SortType.TIME:
        this.#waypoints.sort(sortWaypointsByTime);
        break;
      case SortType.PRICE:
        this.#waypoints.sort(sortWaypointsByPrice);
        break;
      default:
        return;
    }
    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortOptions(sortType);
    this.#deleteWaypoints();
    this.#renderWaypoints();
  };
}
