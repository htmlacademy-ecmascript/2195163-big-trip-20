import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filters-model.js';
import PointsApiService from './points-api-service.js';
import FiltersPresenter from './presenter/filters-presenter.js';

const AUTHORIZATION = 'Basic erth324512saaabv';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';

const filtersControlsElement = document.querySelector(
  '.trip-controls__filters'
);
const tripEventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filtersModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  bodyContainer: tripEventsContainer,
  pointsModel,
  filtersModel,
});

const filtersPresenter = new FiltersPresenter({
  filterContainer: filtersControlsElement,
  filtersModel,
  pointsModel,
});

filtersPresenter.init();
boardPresenter.init();
pointsModel.init();
