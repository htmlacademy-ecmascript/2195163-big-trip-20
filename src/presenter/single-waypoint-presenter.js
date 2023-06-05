import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, remove, replace } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';

export default class SingleWaypointPresenter {
  #waypointComponent = null;
  #waypointEditComponent = null;
  #waypointModel = null;
  #elem = null;
  #state = Mode.CLOSED;

  #pointsContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  constructor({ pointsContainer, onDataChange, onModeChange, waypointModel }) {
    this.#pointsContainer = pointsContainer;
    this.#handleModeChange = onModeChange;
    this.#handleDataChange = onDataChange;
    this.#waypointModel = waypointModel;
  }

  init(elem) {
    this.#elem = elem;

    const prevPointComponent = this.#waypointComponent;
    const prevEditComponent = this.#waypointEditComponent;

    this.#waypointComponent = new WaypointView({
      waypoint: this.#elem,
      onEditClick: this.#handleEditClick,
      handleFavourite: this.#handleFavClick,
    });

    this.#waypointEditComponent = new EditFormView({
      waypoint: this.#elem,
      onFormSubmit: this.#formSubHandler,
      onFormCancel: this.#formCancelHandler,
      onFormDelete: this.#formDeleteHandler,
      waypointModel: this.#waypointModel,
    });

    if (prevPointComponent === null || prevEditComponent === null) {
      render(this.#waypointComponent, this.#pointsContainer);
      return;
    }

    if (this.#state === Mode.OPENED) {
      replace(this.#waypointComponent, prevPointComponent);
    }

    if (this.#state === Mode.CLOSED) {
      replace(this.#waypointEditComponent, prevEditComponent);
    }

    remove(prevPointComponent);
    remove(prevEditComponent);
  }

  #handleFavClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, {
      ...this.#elem,
      isFavourite: !this.#elem.isFavourite,
    });
  };

  #handleEditClick = () => {
    this.replaceInfoToEdit();
  };

  #formSubHandler = (point) => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    this.replaceEditToInfo();
  };

  #formCancelHandler = () => {
    this.resetView();
  };

  #formDeleteHandler = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #escDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#waypointEditComponent.reset(this.#elem);
      this.replaceEditToInfo();
      document.removeEventListener('keydown', this.#escDownHandler);
    }
  };

  replaceEditToInfo() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    document.removeEventListener('keydown', this.#escDownHandler);
    this.#state = Mode.CLOSED;
  }

  replaceInfoToEdit() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    document.addEventListener('keydown', this.#escDownHandler);
    this.#handleModeChange();
    this.#state = Mode.OPENED;
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  resetView() {
    if (this.#state !== Mode.CLOSED) {
      this.replaceEditToInfo();
    }
  }
}
