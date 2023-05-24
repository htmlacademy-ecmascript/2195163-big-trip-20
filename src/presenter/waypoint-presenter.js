import { render } from '../framework/render.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';
import SingleWaypointPresenter from './single-waypoint-presenter.js';

export default class WaypointPresenter {
  #eventComponent = new EventsListView();
  #waypoints = [];
  #waypointsInst = [];
  #waypointContainer = null;

  constructor({ waypointContainer, newSourcedWaypoints }) {
    this.#waypointContainer = waypointContainer;
    this.newSourcedWaypoints = newSourcedWaypoints;
  }

  init(waypointsArray) {
    this.#waypoints = waypointsArray;
    if (waypointsArray.length === 0) {
      render(new NotificationNewEventView(), this.#waypointContainer);
    }
    render(this.#eventComponent, this.#waypointContainer);
    for (let i = 0; i < waypointsArray.length; i++) {
      this.#renderWaypont(waypointsArray[i], this.#eventComponent.element);
    }
  }

  #renderWaypont(waypoint, placeToRender) {
    const singleWaypointPresenter = new SingleWaypointPresenter(
      waypoint,
      this.changeFav,
      this.resetToClosed,
      this.updateWaypoint
    );
    this.#waypointsInst.push(singleWaypointPresenter);
    singleWaypointPresenter.renderWaypont(placeToRender);
  }

  clearList = () => {
    this.#waypointsInst.forEach((elem) => {
      elem.destroy();
    });
  };

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
    this.init(this.#waypoints);
  };

  resetToClosed = () => {
    this.#waypointsInst.forEach((elem) => {
      elem.resetView();
    });
  };

  updateWaypoint = (updatedWaypoint) => {
    this.#waypoints = this.#waypoints.map((elem) => {
      if (elem.id === updatedWaypoint.id) {
        return updatedWaypoint;
      }
      return elem;
    });
    this.clearList();
    this.init(this.#waypoints);
    this.newSourcedWaypoints(this.#waypoints);
  };
}
