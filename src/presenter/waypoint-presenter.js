import { render, replace } from '../framework/render.js';
// import EditFormView from '../view/edit-form-view.js';
import EditNoPhotoFormView from '../view/edit-form-no-photos-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';

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

    render(this.#eventComponent, this.#waypointContainer);
    for (let i = 1; i < this.#waypoints.length; i++) {
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

    const waypointEditComponent = new EditNoPhotoFormView({
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
