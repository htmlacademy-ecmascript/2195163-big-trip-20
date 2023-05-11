import { render, replace } from '../framework/render.js';
import EditFormNoPhotosView from '../view/edit-form-no-photos-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';
import NotificationNewEventView from '../view/notification-new-event-view.js';

export default class WaypointPresenter {
  #eventComponent = new EventsListView();
  #waypoints = [];
  #waypointContainer = null;
  #waypointModel = null;

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
      this.#renderWaypoint(this.#waypoints[i]);
    }
  }

  #renderWaypoint(waypoint) {
    const ecsKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      }
    };

    const waypointComponent = new WaypointView({
      waypoint,
      onEditClick: () => {
        replaceInfoToEdit();
        document.addEventListener('keydown', ecsKeydownHandler);
      },
    });

    const waypointEditComponent = new EditFormNoPhotosView({
      waypoint,
      onFormSubmit: () => {
        replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      },
      onFormCancel: () => {
        replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      },
    });

    function replaceInfoToEdit() {
      replace(waypointEditComponent, waypointComponent);
    }

    function replaceEditToInfo() {
      replace(waypointComponent, waypointEditComponent);
    }

    render(waypointComponent, this.#eventComponent.element);
  }
}
