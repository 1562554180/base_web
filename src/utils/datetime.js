export function getDayStartTamp(millis) {
  return millis - millis % (24 * 60 * 60 * 1000);
}

export function getHourStartTamp(millis) {
  return millis - millis % (60 * 60 * 1000);
}
