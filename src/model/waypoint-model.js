import Observable from '../framework/observable.js';
import { getRandomData } from '../mock/mocks.js';

const WAYPOINTS_COUNT = 5;

export default class WaypointsModel extends Observable {
  #waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomData);

  get points() {
    return this.#waypoints;
  }

  updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('Can\'t update');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addWaypoint(updateType, update) {
    this.#waypoints = [update, ...this.#waypoints];

    this._notify(updateType, update);
  }

  deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );
    if (index === -1) {
      throw new Error('Can\'t delete');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
