import { FilterType } from './const.js';
import { isPointPast, isPointPresent, isPointFuture } from './utils.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
  [FilterType.PRESENT]: (points) =>
    points.filter((point) => isPointPresent(point)),
  [FilterType.FUTURE]: (points) =>
    points.filter((point) => isPointFuture(point)),
};

export { filter };
