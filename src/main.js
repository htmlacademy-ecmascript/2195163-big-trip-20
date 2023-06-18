import MainPresenter from './presenter/main-presenter.js';
import WaypointModel from './model/waypoint-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import PointsApiService from './points-api-service.js';
import { render } from './framework/render.js';
import { Url, AUTHORIZATION } from './const.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector(
  '.trip-controls__filters'
);
const tripEventsElement = document.querySelector('.trip-events');

const waypointModel = new WaypointModel({
  pointsApiService: new PointsApiService(Url.MAIN, AUTHORIZATION),
  handleError: handleNewTaskFormUnable,
});
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({
  tripMain: tripMainElement,
  tripControlsFiltres: tripControlsFiltersElement,
  tripEventsElement: tripEventsElement,
  waypointModel,
  filterModel,
  onPointDestroy: handleNewTaskFormClose,
});

const newPointButtonComponent = new NewEventButtonView({
  onClick: handleNewTaskButtonClick,
});

function handleNewTaskFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewTaskFormUnable() {
  newPointButtonComponent.element.disabled = true;
}

function handleNewTaskButtonClick() {
  mainPresenter.createWaypoint();
  newPointButtonComponent.element.disabled = true;
}

mainPresenter.init();
waypointModel.init().finally(() => {
  render(newPointButtonComponent, tripMainElement);
});
