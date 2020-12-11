// @flow

export type DispatchersFromRedux = {|
  onCancel: () => void,
|};

export type PropsFromRedux = $ReadOnly<{|
  isProgramSelected: boolean,
  isOrgUnitSelected: boolean,
|}>;

export type Props = {|
  ...DispatchersFromRedux,
  ...PropsFromRedux,
  ...CssClasses,
|};
