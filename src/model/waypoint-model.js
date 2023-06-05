import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class WaypointModel extends Observable {
  #pointsApiService = null;

  #waypoints = [];
  #offers = [];
  #destinations = [];

  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#waypoints;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      this.#destinations = await this.#pointsApiService.destinations;
      this.#offers = await this.#pointsApiService.offers;
      this.#waypoints = this.#adaptToClient(
        points,
        this.#destinations,
        this.#offers
      );
    } catch (err) {
      this.#waypoints = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updateWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );

    if (index === -1) {
      throw new Error('updt waypoint error');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptSingleToClient(
        response,
        this.#destinations,
        this.#waypoints
      );
      this.#waypoints = this.#waypoints.map((point) =>
        point.id === updatedPoint.id ? update : point
      );
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('cant update');
    }
  }

  async addWaypoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptSingleToClient(
        response,
        this.#destinations,
        this.#offers
      );
      this.#waypoints.unshift(newPoint);
      this._notify(updateType, newPoint);
    } catch (err) {
      throw new Error('cant add');
    }
  }

  async deleteWaypoint(updateType, update) {
    const index = this.#waypoints.findIndex(
      (waypoint) => waypoint.id === update.id
    );
    if (index === -1) {
      throw new Error('Can\'t delete');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#waypoints = this.#waypoints.filter(
        (waypoint) => waypoint.id !== update.id
      );
      this._notify(updateType);
    } catch (err) {
      throw new Error('cant delete');
    }
  }

  #adaptSingleToClient(point, destinations, offers) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom:
        point['date_from'] !== null
          ? new Date(point['date_from'])
          : point['date_from'],
      dateTo:
        point['date_to'] !== null
          ? new Date(point['date_to'])
          : point['date_to'],
      isFavourite: point['is_favorite'],
    };

    adaptedPoint.destination = destinations.find(
      (pt) => pt.id === adaptedPoint.destination
    );

    if (adaptedPoint.offers.length) {
      const typeOffers = offers.find(
        (typeOffer) => typeOffer.type === adaptedPoint.type
      );

      adaptedPoint.offers = adaptedPoint.offers.map((id) =>
        typeOffers.offers.find((elem) => elem.id === id)
      );
    }

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  #adaptToClient(points, destinations, offers) {
    const adaptedPoints = points.map((elem) => {
      const adaptedPoint = {
        ...elem,
        basePrice: elem['base_price'],
        dateFrom:
          elem['date_from'] !== null
            ? new Date(elem['date_from'])
            : elem['date_from'],
        dateTo:
          elem['date_to'] !== null
            ? new Date(elem['date_to'])
            : elem['date_to'],
        isFavourite: elem['is_favorite'],
      };

      adaptedPoint.destination = destinations.find(
        (point) => point.id === adaptedPoint.destination
      );

      if (adaptedPoint.offers.length) {
        const typeOffers = offers.find(
          (typeOffer) => typeOffer.type === adaptedPoint.type
        );

        adaptedPoint.offers = adaptedPoint.offers.map((id) =>
          typeOffers.offers.find((el) => el.id === id)
        );
      }

      delete adaptedPoint['base_price'];
      delete adaptedPoint['date_from'];
      delete adaptedPoint['date_to'];
      delete adaptedPoint['is_favorite'];

      return adaptedPoint;
    });
    return adaptedPoints;
  }
}
