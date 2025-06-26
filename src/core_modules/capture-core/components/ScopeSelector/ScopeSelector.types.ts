import type { ReactNode } from 'react';

export type OwnProps = {
  isUserInteractionInProgress?: boolean;
  pageToPush?: string;
  selectedOrgUnitId?: string;
  selectedProgramId?: string | null;
  previousOrgUnitId?: string;
  selectedCategories?: Record<string, any>;
  onSetProgramId?: (id: string) => void;
  onResetProgramId: () => void;
  onSetOrgUnit?: (id: string, orgUnit: Record<string, any>) => void;
  onResetOrgUnitId: () => void;
  onSetCategoryOption?: (categoryOption: Record<string, any>, categoryId: string) => void;
  onResetAllCategoryOptions?: () => void;
  onResetCategoryOption?: (categoryId: string) => void;
  onStartAgain: () => void;
  formIsOpen?: boolean;
  children: ReactNode;
  isReadOnlyOrgUnit?: boolean;
  orgUnitTooltip?: boolean;
};

export type PropsFromRedux = {
  ready: boolean;
};

export type Props = {
  selectedOrgUnit: Record<string, any>;
  onResetProgramId: (baseAction: any) => void;
  formIsOpen: boolean;
} & OwnProps & PropsFromRedux;

export type State = {
  openOrgUnitWarning: boolean;
  openProgramWarning: any | null;
  openCatComboWarning: boolean;
  openStartAgainWarning: boolean;
  categoryIdToReset: string;
};
