// @flow
import isArray from 'd2-utilizr/src/isArray';

export default function isNonEmptyArray(toCheck: any) {
    return (!!toCheck && isArray(toCheck) && toCheck.length > 0);
}
