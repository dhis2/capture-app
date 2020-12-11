// @flow
import React, { useMemo } from 'react';
import { ManagerContext } from '../../workingLists.context';
import type { Props } from './workingListsManagerContextProvider.types';

export const WorkingListsManagerContextProvider = ({
  currentTemplate,
  onSelectTemplate,
  children,
}: Props) => {
  const managerContextData = useMemo(
    () => ({
      currentTemplate,
      onSelectTemplate,
    }),
    [currentTemplate, onSelectTemplate],
  );

  return <ManagerContext.Provider value={managerContextData}>{children}</ManagerContext.Provider>;
};
