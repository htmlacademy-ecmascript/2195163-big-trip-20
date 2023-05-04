import { RenderPosition , render } from '../render.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventsListView from '../view/events-list-view.js';


export default class WaypointPresenter{
  eventComponent = new EventsListView();

  constructor({waypointContainer, waypointModel}) {
    this.waypointContainer = waypointContainer;
    this.waypointModel = waypointModel;
  }

  init() {
    this.waypoints = [...this.waypointModel.getWaypoints()];

    render(this.eventComponent, this.waypointContainer);
    render(new EditFormView({waypoint: this.waypoints[0]}), this.eventComponent.getElement(), RenderPosition.AFTERBEGIN);
    for (let i = 1; i < this.waypoints.length; i++) {
      render(new WaypointView({waypoint: this.waypoints[i]}), this.eventComponent.getElement());
    }
  }
}
