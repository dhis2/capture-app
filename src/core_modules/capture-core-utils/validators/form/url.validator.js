// @flow

/**
 *
 * @export
 * @param {string} value
 * @returns
 */
const isValidUrl = (value: string) => {
  const match = value.match(
    /^(http|https):\/\/[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/,
  );
  return match !== null;
};

export default isValidUrl;
