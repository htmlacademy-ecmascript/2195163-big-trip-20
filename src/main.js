import MainPresenter from './presenter/main-presenter.js';
import WaypointPresenter from './presenter/waypoint-presenter.js';
import WaypointModel from './model/waypoint-model.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsSection = document.querySelector('.trip-events');

const waypointModel = new WaypointModel();
const mainPresenter = new MainPresenter({tripMain: tripMainElement, tripControlsFiltres: tripControlsFiltersElement, tripEventsSection: tripEventsSection});
const waypointPresenter = new WaypointPresenter({waypointContainer: tripEventsSection, waypointModel});

mainPresenter.init();
waypointPresenter.init();
