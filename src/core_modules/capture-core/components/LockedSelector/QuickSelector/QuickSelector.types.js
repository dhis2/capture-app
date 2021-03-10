// @flow

export type State = {|
  openStartAgainWarning: boolean;
  openOrgUnitWarning: boolean;
  openProgramWarning: ?Object;
  openCatComboWarning: boolean;
  categoryIdToReset: string;
  openNewEventWarning: boolean;
|};

export type PropsFromRedux = $ReadOnly<{|
  selectedOrgUnitId: string,
  selectedProgramId: string,
  selectedCategories: Object,
  selectedOrgUnit: Object,
  currentPage: string,
  selectedEnrollmentId: string,
  selectedTeiName: string,
  selectedTetName: string,
  enrollmentsAsOptions: Array<Object>,
  enrollmentLockedSelectReady: boolean,
|}>

export type DispatchersFromRedux = $ReadOnly<{|
  onTeiSelectionReset: () => void,
  onEnrollmentSelectionSet: () => void,
  onEnrollmentSelectionReset: () => void,
|}>

export type OwnProps = $ReadOnly<{|
  onSetOrgUnit: (orgUnitId: string, orgUnitObject: Object) => void,
  onSetProgramId: (programId: string) => void,
  onSetCategoryOption: (categoryId: string, categoryOptionId: string) => void,
  onResetOrgUnitId: () => void,
  onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
  onResetCategoryOption: (categoryId: string) => void,
  onResetAllCategoryOptions: () => void,
  onStartAgain: () => void,
  onNewClick: () => void,
  onNewClickWithoutProgramId: () => void,
  onFindClick: () => void,
  onFindClickWithoutProgramId: () => void,
|}>

export type Props = {|
  ...OwnProps,
  ...CssClasses,
  ...DispatchersFromRedux,
  ...PropsFromRedux,
|}
