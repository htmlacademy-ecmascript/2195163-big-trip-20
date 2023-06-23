import ListView from '../view/list-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import SortView from '../view/sort-view.js';
import { RenderPosition, render, remove } from '../framework/render.js';
import { sortDay, sortTime, sortPrice } from '../utils.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../filter.js';
import NoPointsView from '../view/no-point-view.js';
import LoadingView from '../view/loading-view.js';
import PointInfoView from '../view/point-info-view.js';
import ErrorView from '../view/error-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

const tripMainElement = document.querySelector('.trip-main');

export default class BoardPresenter {
  #sortComponent = null;
  #listComponent = new ListView();
  #noPointsComponent = null;
  #loadingComponent = new LoadingView();
  #infoComponent = null;
  #bodyContainer = null;
  #newPointButtonComponent = null;

  #pointsModel = null;
  #filtersModel = null;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  constructor({ bodyContainer, pointsModel, filtersModel }) {
    this.#bodyContainer = bodyContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
    return filteredPoints;
  }

  init = () => {
    this.#renderBoard();
  };

  createPoint = () => {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init(
      this.#pointsModel.offers,
      this.#pointsModel.destinations
    );
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
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderNewPointButton = () => {
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick,
    });
    render(this.#newPointButtonComponent, tripMainElement);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange,
    });
    render(this.#sortComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  };

  #renderInfo = () => {
    if (this.#infoComponent) {
      remove(this.#infoComponent);
    }

    const points = this.points.sort(sortDay);
    const offers = this.#pointsModel.offers;
    const destinations = this.#pointsModel.destinations;

    this.#infoComponent = new PointInfoView(points, offers, destinations);
    render(this.#infoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
  };

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointFormClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #handleViewAction = async (actionType, updateType, updateElement) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(updateElement.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, updateElement);
        } catch (err) {
          this.#pointPresenters.get(updateElement.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, updateElement);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(updateElement.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, updateElement);
        } catch (err) {
          this.#pointPresenters.get(updateElement.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        this.#renderInfo();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        this.#renderNewPointButton();
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderError('Can\'t reach server. Please try again...');
    }
  };

  #renderPoint = (point) => {
    const pointComponentPresenter = new PointPresenter({
      pointsListContainer: this.#listComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      point: point,
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
    });
    this.#pointPresenters.set(point.id, pointComponentPresenter);
  };

  #renderNoPoints = () => {
    this.#noPointsComponent = new NoPointsView({
      filterType: this.#filterType,
    });

    render(
      this.#noPointsComponent,
      this.#bodyContainer,
      RenderPosition.AFTERBEGIN
    );
  };

  #renderLoading = () => {
    render(
      this.#loadingComponent,
      this.#bodyContainer,
      RenderPosition.AFTERBEGIN
    );
  };

  #renderError = (errorMessage) => {
    const errorComponent = new ErrorView({
      message: errorMessage,
    });
    render(errorComponent, this.#bodyContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({ resetSortType = false } = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);

    if (this.#noPointsComponent) {
      remove(this.#noPointsComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  };

  #renderBoard = () => {
    render(this.#listComponent, this.#bodyContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointsCount = points.length;

    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderInfo();
    this.#renderSort();
    this.points.forEach((point) => this.#renderPoint(point));
  };
}
