import EventsListView from '../view/events-list-view.js';
import SortView from '../view/sort-view.js';
import PointAddView from '../view/point-add-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class EventsListPresenter {
  eventsListComponent = new EventsListView();

  constructor({eventsContainer}) {
    this.eventsContainer = eventsContainer;
  }

  init() {
    render(new SortView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);
    render(new PointAddView(), this.eventsListComponent.getElement());
    render(new PointEditView(), this.eventsListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventsListComponent.getElement());
    }
  }
}
