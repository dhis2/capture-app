// @flow
import type { Node } from 'react';

export type OwnProps = $ReadOnly<{|
  isUserInteractionInProgress?: boolean,
  pageToPush?: string,
  selectedOrgUnitId?: string,
  selectedProgramId?: string,
  previousOrgUnitId?: string,
  selectedCategories?: { [categoryId: string]: { writeAccess: boolean } },
  onSetProgramId?: (id: string) => void,
  onResetProgramId: () => void,
  onSetOrgUnit?: (id: string, orgUnit: Object) => void,
  onResetOrgUnitId: () => void,
  onSetCategoryOption?: (categoryOption: Object, categoryId: string) => void,
  onResetAllCategoryOptions?: () => void,
  onResetCategoryOption?: (categoryId: string) => void,
  onStartAgain: () => void,
  formIsOpen?: boolean,
  children: Node,
|}>

export type PropsFromRedux = $ReadOnly<{|
  ready: boolean,
|}>

export type Props = {|
  ...OwnProps,
  ...CssClasses,
  ...PropsFromRedux,
  selectedOrgUnit: Object,
  onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
  formIsOpen: boolean,
|}

export type State = {|
  openOrgUnitWarning: boolean;
  openProgramWarning: ?Object;
  openCatComboWarning: boolean;
  openStartAgainWarning: boolean;
  categoryIdToReset: string;
|};
