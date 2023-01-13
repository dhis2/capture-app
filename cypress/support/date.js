import moment from 'moment';

export const getCurrentYear = () => moment().year();

export const getCurrentDate = () => moment().format('YYYY-DD-MM');

export const combineDataAndYear = (year, data) => Object.keys(data)
    .reduce((acc, key) => { acc[`${year}-${key}`] = data[key]; return acc; }, {});
