// @flow
import React from 'react';
import { withStyles } from '@material-ui/core';
import { useProgramInfo } from '../../../hooks/useProgramInfo';
import { StagesAndEventsWidget } from './StagesAndEventsWidget';

export const EnrollmentDummyPlain = ({ classes }: Object) => (
    <StagesAndEventsWidget
        stages={useProgramInfo('IpHINAT79UW').program.stages}
        className={classes.stagesAndEvents}
    />
);

export const EnrollmentDummy = withStyles({ stagesAndEvents: { margin: 16 } })(EnrollmentDummyPlain);
