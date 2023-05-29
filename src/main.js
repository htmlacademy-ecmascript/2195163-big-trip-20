import MainPresenter from './presenter/main-presenter.js';
import WaypointModel from './model/waypoint-model.js';
import FilterModel from './model/filter-model.js';
import NewEventButtonView from './view/new-event-button-view.js';
import { render } from './framework/render.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector(
  '.trip-controls__filters'
);
const tripEventsSection = document.querySelector('.trip-events');

const waypointModel = new WaypointModel();
const filterModel = new FilterModel();
const mainPresenter = new MainPresenter({
  tripMain: tripMainElement,
  tripControlsFiltres: tripControlsFiltersElement,
  tripEventsSection: tripEventsSection,
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

function handleNewTaskButtonClick() {
  mainPresenter.createWaypoint();
  newPointButtonComponent.element.disabled = true;
}
render(newPointButtonComponent, tripMainElement);

mainPresenter.init();
