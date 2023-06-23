import AbstractView from '../framework/view/abstract-view.js';

const createNewPointButtonTemplate = () =>
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';

export default class NewPointButtonView extends AbstractView {
  #handleNewPointBtnClick = null;

  constructor({ onClick }) {
    super();
    this.#handleNewPointBtnClick = onClick;
    this.element.addEventListener('click', this.#newPointBtnClickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #newPointBtnClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewPointBtnClick();
  };
}
