import AbstractView from '../framework/view/abstract-view';
import { FiltersType } from '../const';

const NoEventsTextType = {
  [FiltersType.EVERYTHING]: 'Click New Event to create your first point',
  [FiltersType.FUTURE]: 'There are no future events now',
  [FiltersType.PAST]: 'There are no past events now',
  [FiltersType.PRESENT]: 'There are no present events now',
};

function createNotification(filterType, model) {
  const noEventsTextValue = NoEventsTextType[filterType];
  const isOffersOrDestinationsEmpty =
    !model.offers.length || !model.destinations.length;

  return `<p class="trip-events__msg">
  ${
  isOffersOrDestinationsEmpty
    ? 'Server issues, please stand by'
    : noEventsTextValue
}
  </p>`;
}

export default class NotificationNewEventView extends AbstractView {
  #filterType = null;
  #waypointModel = null;

  constructor({ filterType, waypointModel }) {
    super();
    this.#filterType = filterType;
    this.#waypointModel = waypointModel;
  }

  get template() {
    return createNotification(this.#filterType, this.#waypointModel);
  }
}
