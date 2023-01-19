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
  isSavingInProgress?: boolean,
  onResetProgramId: (baseAction: ReduxAction<any, any>) => void,
  onContextChangeWhileSaving: () => void,
  onCancelContextChange: () => void,
|}

export type State = {|
  openOrgUnitWarning: boolean;
  openProgramWarning: ?Object;
  openCatComboWarning: boolean;
  categoryIdToReset: string;
  openSavingInProgress: boolean;
  contextChangeFallback?: ?(arg?: any) => void,
|};
