import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const MILLISECONDS_IN_HOUR = 3600000;
const MILLISECONDS_IN_DAY = MILLISECONDS_IN_HOUR * 24;

const getTimeDiff = (startTime, endTime, isNeedFormat = true) => {
  let timeDuration = dayjs(endTime).diff(dayjs(startTime));
  if (isNeedFormat) {
    switch (true) {
      case timeDuration < MILLISECONDS_IN_HOUR:
        timeDuration = dayjs.duration(timeDuration).format('mm[M]');
        break;
      case timeDuration >= MILLISECONDS_IN_HOUR &&
        timeDuration < MILLISECONDS_IN_DAY:
        timeDuration = dayjs.duration(timeDuration).format('HH[H] mm[M]');
        break;
      case timeDuration >= MILLISECONDS_IN_DAY:
        timeDuration = dayjs.duration(timeDuration).format('DD[D] HH[H] mm[M]');
        break;
    }
    return timeDuration;
  }
  return timeDuration;
};

export { getTimeDiff };
