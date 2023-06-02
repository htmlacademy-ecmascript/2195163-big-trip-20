import AbstractView from '../framework/view/abstract-view';
import { FiltersType } from '../const';

const NoEventsTextType = {
  [FiltersType.EVERYTHING]: 'Click New Event to create your first point',
  [FiltersType.FUTURE]: 'There are no future events now',
  [FiltersType.PAST]: 'There are no past events now',
  [FiltersType.PRESENT]: 'There are no present events now',
};

function createNotification(filterType) {
  const noEventsTextValue = NoEventsTextType[filterType];

  return `<p class="trip-events__msg">
  ${noEventsTextValue}
  </p>`;
}

export default class NotificationNewEventView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNotification(this.#filterType);
  }
}
