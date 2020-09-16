// @flow
export type OwnProps = $ReadOnly<{|
  isUserInteractionInProgress?: boolean,
  customActionsOnOrgUnitIdReset?: Array<any>,
  customActionsOnProgramIdReset?: Array<any>,
|}>

export type PropsFromRedux = $ReadOnly<{|
  selectedOrgUnitId: string,
  selectedProgramId: string,
  ready: boolean,
|}>

export type DispatchersFromRedux = $ReadOnly<{|
  onOpenNewEventPage: (selectedProgramId: string, selectedOrgUnitId: string) => void,
  onOpenSearchPage: (selectedProgramId: string, selectedOrgUnitId: string) => void,
  onSetOrgUnit: (id: string, orgUnit: Object) => void,
  onResetOrgUnitId: () => void,
  onSetProgramId: (id: string) => void,
  onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
  onResetCategoryOption: (categoryId: string) => void,
  onResetAllCategoryOptions: () => void,
  onStartAgain: () => void,
  onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
|}>


export type Props = {|
  ...OwnProps,
  ...CssClasses,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
|}


export type State = {|
  openStartAgainWarning: boolean;
  openOrgUnitWarning: boolean;
  openProgramWarning: ?Object;
  openCatComboWarning: boolean;
  categoryIdToReset: string;
  openNewEventWarning: boolean;
|};
