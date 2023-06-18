import TripInfoView from '../view/trip-info-view.js';
import TripSortView from '../view/sorting-view.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';
import FilterPresenter from './filter-presenter.js';
import NewPointPresenter from './new-waypoint-presenter.js';
import LoadingView from '../view/loading-view.js';
import {
  SortType,
  UpdateType,
  UserAction,
  FiltersType,
  TimeLimit,
} from '../const.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import { sortWaypointsByTime, sortWaypointsByPrice, filter } from '../utils.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class MainPresenter {
  #tripMain = null;
  #tripControlsFilters = null;
  #tripEventsElement = null;
  #sortComponent = null;

  #infoViewComponent = null;
  #eventComponent = new EventsListView();
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #notiComponent = null;
  #waypointModel = null;
  #filterModel = null;
  #filterType = FiltersType.EVERYTHING;

  #currentSortType = SortType.DATE;
  #isLoading = true;
  #newPointPresenter = null;
  #pointPresenters = new Map();

  constructor({
    tripMain,
    tripControlsFiltres,
    tripEventsElement,
    waypointModel,
    filterModel,
    onPointDestroy,
  }) {
    this.#tripMain = tripMain;
    this.#tripControlsFilters = tripControlsFiltres;
    this.#tripEventsElement = tripEventsElement;

    this.#waypointModel = waypointModel;
    this.#waypointModel.addObserver(this.#handleModelEvent);
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#newPointPresenter = new NewPointPresenter({
      waypointListContainer: this.#eventComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onPointDestroy,
      waypointModel: this.#waypointModel,
    });
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = [...this.#waypointModel.points];
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints;
      case SortType.TIME:
        return filteredPoints.sort(sortWaypointsByTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortWaypointsByPrice);
    }
    return filteredPoints;
  }

  init() {
    this.#renderTripInfo();
  }

  createWaypoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FiltersType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #renderFilters() {
    const filtersPresenter = new FilterPresenter({
      filterContainer: this.#tripControlsFilters,
      filterModel: this.#filterModel,
      waypointsModel: this.#waypointModel,
    });
    filtersPresenter.init();
  }

  #renderSortOptions() {
    this.#sortComponent = new TripSortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#tripEventsElement);
  }

  #renderWaypoint(waypoint) {
    const singleWaypointPresenter = new SingleWaypointPresenter({
      pointsContainer: this.#eventComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      waypointModel: this.#waypointModel,
    });
    singleWaypointPresenter.init(waypoint);
    this.#pointPresenters.set(waypoint.id, singleWaypointPresenter);
  }

  #renderWaypoints() {
    this.#infoViewComponent = new TripInfoView({
      waypointModel: this.#waypointModel,
    });
    if (this.points.length) {
      render(
        this.#infoViewComponent,
        this.#tripMain,
        RenderPosition.AFTERBEGIN
      );
      this.#renderSortOptions();
    }
    render(this.#eventComponent, this.#tripEventsElement);
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if (this.points.length === 0) {
      this.#renderNoPoints();
    }
    this.points.forEach((point) => this.#renderWaypoint(point));
  }

  #renderNoPoints() {
    this.#notiComponent = new NotificationNewEventView({
      filterType: this.#filterType,
      waypointModel: this.#waypointModel,
    });
    render(this.#notiComponent, this.#eventComponent.element);
    remove(this.#loadingComponent);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventComponent.element);
  }

  #clearPoints(resetSortType = false) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (resetSortType === true) {
      this.#currentSortType = SortType.DAY;
    }

    remove(this.#notiComponent);
    remove(this.#infoViewComponent);
    remove(this.#sortComponent);
  }

  #renderTripInfo() {
    this.#renderFilters();
    this.#renderWaypoints();
  }

  #rerenderList = () => {
    this.#clearPoints();
    this.#renderWaypoints();
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#waypointModel.addWaypoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#waypointModel.updateWaypoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#waypointModel.deleteWaypoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderWaypoints(this.points);
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#rerenderList();
        break;
      case UpdateType.MAJOR:
        this.#clearPoints(true);
        this.#renderWaypoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderWaypoints();
        break;
    }
  };
}
