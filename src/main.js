/*import {render} from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import FormNewPointView from './view/point-add-view.js';
import InfoView from './info-view.js';

const pageHeader = document.querySelector('.page-header');
const filtersContainer = pageHeader.querySelector('.trip-controls__filters');
const sortContainer = document.querySelector('.trip-events');
const formNewPointContainer = document.querySelector('.event__header');
const infoContainer = document.querySelector('.trip-main');

render(new FilterView(), filtersContainer);
render(new SortView(), sortContainer);
render(new FormNewPointView(), formNewPointContainer);
render(new InfoView(), infoContainer);*/
import FilterView from './view/filter-view.js';
import EventsListPresenter from './presenter/events-list-presenter.js';

import { render } from './render.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const eventsPresenter = new EventsListPresenter({eventsContainer: siteMainElement});

render(new FilterView(), siteHeaderElement);
eventsPresenter.init();
