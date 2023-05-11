import AbstractView from '../framework/view/abstract-view';

function createNotification() {
  return '<p class="trip-events__msg">Click New Event to create your first point</p>';
}

export default class NotificationNewEventView extends AbstractView {
  get template() {
    return createNotification();
  }
}
