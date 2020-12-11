// @flow

/**
 * Some locales are using numeral glyphs other than european. This method ensures the moment format method returns a value in european glyphs
 * @param {*} momentDate: the moment instance
 * @param {string} format: the moment format
 * @returns {string} A formatted string with european glyphs
 */
export function getFormattedStringFromMomentUsingEuropeanGlyphs(
  momentDate: moment$Moment,
  format: string = 'YYYY-MM-DD',
) {
  const europeanMoment = momentDate.clone().locale('en');
  return europeanMoment.format(format);
}
