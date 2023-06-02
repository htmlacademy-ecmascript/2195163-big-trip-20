import { nanoid } from 'nanoid';
import { WAYPOINT_OPTIONS, TRAVEL_WAYPOINTS } from '../const.js';
import { getRandomElem } from '../utils.js';

const mapWaypoints = new Map();
const mapOptions = new Map();

TRAVEL_WAYPOINTS.forEach((elem) => {
  mapWaypoints.set(elem, {
    id: 'cfe416cq-10xa-ye10-8077-2fs9a01edcab',
    description: `THERE SHOULD BE DESCTRIPTION OF ${elem}`,
    name: elem,
    pictures: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
      src: `https://loremflickr.com/248/152?random=${Math.floor(
        Math.random() * 100
      )}`,
      description: `${elem} parliament building`,
    })),
  });
});

WAYPOINT_OPTIONS.forEach((elem) => {
  mapOptions.set(elem, [
    {
      id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
      title: 'Just pay us ',
      price: Math.floor(Math.random() * 100),
    },
  ]);
});

export const getRandomData = () => {
  const type = getRandomElem(WAYPOINT_OPTIONS);
  return {
    id: nanoid(),
    basePrice: Math.floor(Math.random() * 1000),

    dateFrom: new Date(
      2021,
      getRandomArbitrary(10, 11),
      getRandomArbitrary(20, 26),
      getRandomArbitrary(0, 24),
      getRandomArbitrary(0, 60)
    ),

    dateTo: new Date(
      2021,
      getRandomArbitrary(10, 11),
      getRandomArbitrary(26, 27),
      getRandomArbitrary(0, 24),
      getRandomArbitrary(0, 60)
    ),
    destination: mapWaypoints.get(getRandomElem(TRAVEL_WAYPOINTS)),
    isFavourite: [true, false][Math.floor(Math.random() * 2)],
    offers: mapOptions.get(type),
    type: type,
  };
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

export { mapWaypoints, mapOptions };
