/**
 *
 * @param sec default 1
 * @returns second in milliseconds
 */
const secondToMilliseconds = (sec = 1) => sec * 1000;

const convertToTimestamp = (date: string, milliseconds = true) => {
  const timestamp = new Date(date).getTime();
  return milliseconds ? timestamp : timestamp / 1000;
};

export { secondToMilliseconds, convertToTimestamp };
