import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { replace, render, remove } from '../framework/render.js';
import { UserAction, UpdateType, Mode } from '../const.js';
import { isDatesEqual } from '../utils.js';

export default class PointPresenter {
  #handleDataChange = null;
  #handleModeChange = null;

  #pointsListContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #point = null;
  #offers = [];
  #destinations = [];

  #mode = Mode.DEFAULT;

  constructor({
    pointsListContainer,
    onDataChange,
    onModeChange,
    point,
    offers,
    destinations,
  }) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.init(this.#point);
  }

  init = (point) => {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onEditClick: this.#editClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#pointEditComponent = new EditPointView({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,

      onFormSubmit: this.#formSubmitHandler,
      onRollupClick: this.#rollupClickHandler,
      onDeleteClick: this.#deleteClickHandler,
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointsListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  };

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #favoriteClickHandler = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite,
    });
  };

  #editClickHandler = () => {
    this.#replacePointToForm();
  };

  #deleteClickHandler = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #formSubmitHandler = (update) => {
    const isMinorUpdate = isDatesEqual(this.#point.dateTo, update.dateTo);

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.PATCH : UpdateType.MINOR,
      update
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #rollupClickHandler = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  };

  #replacePointToForm = () => {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}
