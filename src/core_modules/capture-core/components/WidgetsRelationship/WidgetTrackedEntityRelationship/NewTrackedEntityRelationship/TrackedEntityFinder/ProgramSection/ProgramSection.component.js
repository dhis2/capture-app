// @flow
import React, { useState, useCallback } from 'react';
import i18n from '@dhis2/d2-i18n';
import { colors, spacersNum } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { Widget } from '../../../../../Widget';
import { ProgramSelectorForTrackedEntityFinder } from './ProgramSelector.component';

const styles = {
    contents: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        borderTop: `1px solid ${colors.grey400}`,
    },
};

const ProgramSectionPlain = ({ trackedEntityTypeId, selectedProgramId, onSelectProgram, getPrograms, classes }) => {
    const [open, setOpenStatus] = useState(true);
    const toggleOpen = useCallback(() => setOpenStatus(currentStatus => !currentStatus), []);
    return (
        <Widget
            header={i18n.t('Program')}
            open={open}
            onOpen={toggleOpen}
            onClose={toggleOpen}
        >
            <div className={classes.contents}>
                <ProgramSelectorForTrackedEntityFinder
                    trackedEntityTypeId={trackedEntityTypeId}
                    selectedProgramId={selectedProgramId}
                    onSelectProgram={onSelectProgram}
                    getPrograms={getPrograms}
                />
            </div>
        </Widget>
    );
};

export const ProgramSection = withStyles(styles)(ProgramSectionPlain);
