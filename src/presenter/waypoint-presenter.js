import { render } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';

export default class WaypointPresenter {
  #eventComponent = new EventsListView();
  #waypoints = [];
  #waypointContainer = null;
  #waypointModel = null;
  #waypointsInst = [];

  constructor({ waypointContainer, waypointModel }) {
    this.#waypointContainer = waypointContainer;
    this.#waypointModel = waypointModel;
  }

  init() {
    this.#waypoints = [...this.#waypointModel.points];
    if (this.#waypoints.length === 0) {
      render(new NotificationNewEventView(), this.#waypointContainer);
    }
    render(this.#eventComponent, this.#waypointContainer);
    for (let i = 0; i < this.#waypoints.length; i++) {
      this.#renderWaypoint(this.#waypoints[i], this.#eventComponent.element);
    }
  }

  #renderWaypoint(waypoint, placeToRender) {
    const singleWaypointPresenter = new SingleWaypointPresenter(
      waypoint,
      this.changeFav,
      this.resetToClosed
    );
    this.#waypointsInst.push(singleWaypointPresenter);
    singleWaypointPresenter.renderWaypont(placeToRender);
  }

  changeFav = (id) => {
    this.#waypoints = this.#waypoints.map((elem) => {
      if (elem.id === id) {
        elem.isFavourite = !elem.isFavourite;
        return elem;
      }
      return elem;
    });
    this.#waypointsInst.forEach((elem) => {
      elem.destroy();
    });
    this.init();
  };

  resetToClosed = () => {
    this.#waypointsInst.forEach((elem) => {
      elem.resetView();
    });
  };
}
