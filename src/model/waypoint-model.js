import { getRandomData } from '../mock/mocks.js';

const WAYPOINTS_COUNT = 0;

export default class WaypointsModel {
  #waypoints = Array.from({ length: WAYPOINTS_COUNT }, getRandomData);

  get points() {
    return this.#waypoints;
  }
}
