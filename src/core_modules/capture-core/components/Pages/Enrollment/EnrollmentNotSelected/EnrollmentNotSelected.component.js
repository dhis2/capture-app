// @flow
import React from 'react';
import { WidgetBreakingTheGlass } from '../../../WidgetBreakingTheGlass';
import { useTrackerProgram } from '../../../../hooks/useTrackerProgram';
import type { Props } from './EnrollmentNotSelected.types';

export const EnrollmentNotSelected = ({ programId }: Props) => {
    const program = useTrackerProgram(programId);

    return <WidgetBreakingTheGlass />;
}
