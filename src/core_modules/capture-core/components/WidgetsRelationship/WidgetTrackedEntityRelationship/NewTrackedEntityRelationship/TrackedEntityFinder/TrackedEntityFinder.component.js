// @flow
import React, { useCallback, useState, type ComponentType } from 'react';
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import { ProgramSection } from './ProgramSection';
import type { PlainProps, Props } from './TrackedEntityFinder.types';
import { SearchFormSection } from './SearchFormSection';

const styles = {
    container: {
        marginLeft: spacersNum.dp16,
        marginRight: spacersNum.dp16,
        marginBottom: spacersNum.dp16,
    },
};

const TrackedEntityFinderPlain = ({
    trackedEntityTypeId,
    defaultProgramId = null,
    getPrograms,
    getSearchGroups,
    getSearchGroupsAsync,
    classes,
}: PlainProps) => {
    const [selectedProgramId, setProgramId] = useState(defaultProgramId);
    const handleSelectProgram = useCallback(id => setProgramId(id), []);

    return (
        <div className={classes.container}>
            <ProgramSection
                trackedEntityTypeId={trackedEntityTypeId}
                selectedProgramId={selectedProgramId}
                onSelectProgram={handleSelectProgram}
                getPrograms={getPrograms}
            />
            <SearchFormSection
                programId={selectedProgramId}
                getSearchGroups={getSearchGroups}
                getSearchGroupsAysnc={getSearchGroupsAsync}
            />
        </div>
    );
};

export const TrackedEntityFinder: ComponentType<Props> = withStyles(styles)(TrackedEntityFinderPlain);
