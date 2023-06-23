import ApiService from './framework/api-service.js';

const Method = {
  PUT: 'PUT',
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE'
};

export default class PointsApiService extends ApiService {
  getPoints = () =>
    this._load({url: 'points'})
      .then(ApiService.parseResponse);

  getOffers = () =>
    this._load({url: 'offers'})
      .then(ApiService.parseResponse);

  getDestinations = () =>
    this._load({url: 'destinations'})
      .then(ApiService.parseResponse);

  addPoint = async (point) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'Application/json'})
    });

    return await ApiService.parseResponse(response);
  };

  deletePoint = async (point) =>
    await this._load({
      url: `points/${point.id}`,
      method: Method.DELETE,
    });

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'type': point.eventType,
      'destination': point.destinationId,
      'base_price': +point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite ?? false,
    };

    delete adaptedPoint.eventType;
    delete adaptedPoint.destinationId;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  };
}
