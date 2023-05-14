import EditFormNoPhotosView from '../view/edit-form-no-photos-view.js';
import WaypointView from '../view/waypoint-view.js';
import { render, remove, replace } from '../framework/render.js';
import { MODE } from '../const.js';

export default class SingleWaypointPresenter {
  #waypointComponent = null;
  #waypointEditComponent = null;
  #elem = null;
  #state = MODE.closed;

  constructor(elem, changeFav, resetToClosed) {
    this.#elem = elem;
    this.changeFav = changeFav;
    this.resetToClosed = resetToClosed;

    const ecsKeydownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      }
    };

    this.#waypointComponent = new WaypointView({
      waypoint: this.#elem,
      onEditClick: () => {
        this.resetToClosed(this.#elem.id);
        this.replaceInfoToEdit();
        document.addEventListener('keydown', ecsKeydownHandler);
      },
      handleFavourite: () => {
        this.changeFav(this.#elem.id);
      },
    });

    this.#waypointEditComponent = new EditFormNoPhotosView({
      waypoint: this.#elem,
      onFormSubmit: () => {
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      },
      onFormCancel: () => {
        this.replaceEditToInfo();
        document.removeEventListener('keydown', ecsKeydownHandler);
      },
    });
  }

  replaceEditToInfo() {
    replace(this.#waypointComponent, this.#waypointEditComponent);
    this.#state = MODE.closed;
  }

  replaceInfoToEdit() {
    replace(this.#waypointEditComponent, this.#waypointComponent);
    this.#state = MODE.opened;
  }

  destroy() {
    remove(this.#waypointComponent);
    remove(this.#waypointEditComponent);
  }

  renderWaypont(place) {
    render(this.#waypointComponent, place);
  }

  resetView() {
    if (this.#state !== MODE.closed) {
      this.replaceEditToInfo();
    }
  }
}
