// @flow
import React from 'react';
import { useProgram, programTypes } from '../../../../hooks/useProgram';
import { EventWorkingListsInit } from '../EventWorkingListsInit';
import { TeiWorkingLists } from '../TeiWorkingLists';
import type { Props } from './workingListsType.types';

export const WorkingListsType = ({ programId }: Props) => {
  const { programType } = useProgram(programId);

  if (programType === programTypes.EVENT_PROGRAM) {
    return <EventWorkingListsInit />;
  }

  return <TeiWorkingLists />;
};
