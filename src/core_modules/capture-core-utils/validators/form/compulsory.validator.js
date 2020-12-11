// @flow

export default function hasValue(value: any) {
  return Boolean(value) || value === 0 || value === false;
}
