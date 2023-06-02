import { remove, render, RenderPosition } from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import { nanoid } from 'nanoid';
import { UserAction, UpdateType } from '../const.js';

export default class NewPointPresenter {
  #waypointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #waypointEditComponent = null;

  constructor({ waypointListContainer, onDataChange, onDestroy }) {
    this.#waypointListContainer = waypointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new EditFormView({
      onFormSubmit: this.#handleFormSubmit,
      onFormCancel: this.#handleCancelClick,
      isNew: true,
    });

    render(
      this.#waypointEditComponent,
      this.#waypointListContainer,
      RenderPosition.AFTERBEGIN
    );

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, {
      id: nanoid(),
      ...point,
    });
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
