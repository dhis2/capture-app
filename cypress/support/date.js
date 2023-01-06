import moment from 'moment';

export const getCurrentYear = () => moment().year();

export const getCurrentDate = () => moment().format('YYYY-DD-MM');

export const mapDataAndYear = (year, data) => Object.keys(data).map(key => ({ [`${year}-${key}`]: data[key] }));
