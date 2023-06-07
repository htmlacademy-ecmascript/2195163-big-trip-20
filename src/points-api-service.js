import ApiService from './framework/api-service.js';
import { Urls, Method } from './const.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: Urls.POINTS }).then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({ url: Urls.DESTINATIONS }).then(
      ApiService.parseResponse
    );
  }

  get offers() {
    return this._load({ url: Urls.OFFERS }).then(ApiService.parseResponse);
  }

  async updatePoint(newPoint) {
    const response = await this._load({
      url: `${Urls.POINTS}/${newPoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(newPoint)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: `${Urls.POINTS}`,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = await this._load({
      url: `${Urls.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }

  #adaptToServer(point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from':
        point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
      'is_favorite': point.isFavourite,
    };

    adaptedPoint.destination = adaptedPoint.destination.id;

    if (adaptedPoint.offers.length) {
      adaptedPoint.offers = adaptedPoint.offers.map((elem) => elem.id);
    }

    delete adaptedPoint.isFavourite;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.waypoint;

    return adaptedPoint;
  }
}
