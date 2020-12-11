// @flow
import log from 'loglevel';

let d2Instance: D2;

export function setD2(d2: D2) {
  d2Instance = d2;
}

const getD2 = () => {
  if (!d2Instance) {
    log.error('please set d2 before using it');
  }
  return d2Instance;
};

export const getApi = () => getD2().Api.getApi();

export const getModels = () => getD2().models;

export const getCurrentUser = () => getD2().currentUser;

export const canViewOtherUsers = () => {
  const hasUserViewAuth = getD2().currentUser.authorities.has('F_USER_VIEW');
  return hasUserViewAuth;
};

export default getD2;
