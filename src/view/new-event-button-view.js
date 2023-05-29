import AbstractView from '../framework/view/abstract-view';

function createNewEventButton() {
  return /*html*/ `<button
  class="trip-main__event-add-btn btn btn--big btn--yellow"
  type="button">
  New event
  </button>`;
}

export default class NewEventButtonView extends AbstractView {
  #handleClick = null;

  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewEventButton();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };
}
