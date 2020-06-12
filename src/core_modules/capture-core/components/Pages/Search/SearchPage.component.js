// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { LockedSelector } from '../../LockedSelector';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui-core';
import type { SearchPageComponentProps } from './SearchPage.container';

const getStyles = (theme: Theme) => ({
    container: {
        padding: '10px 24px 24px 24px',
    },
    header: {
        flexGrow: 1,
        fontSize: 18,
        fontWeight: 500,
        paddingLeft: 8,
        paddingBottom: 12,
    },
    dataEntryPaper: {
        // marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        marginBottom: 2000,

    },
    customEmpty: {
        textAlign: 'center',
        padding: '8px 24px',
    },
    groupTitle: {
        padding: '16px 12px',
        fontWeight: 500,
        fontSize: 16,
    },
});

type Props =
    SearchPageComponentProps & {
    classes: {
        container: string,
        header: string,
        dataEntryPaper: string,
        customEmpty: string,
        groupTitle: string,
    },
  }

const Index = ({ classes, trackedEntityTypesWithCorrelatedPrograms, preselectedProgram }: Props) => {
    const [selectedOption, choseSelected] = useState(preselectedProgram);

    return (<>
        <LockedSelector />
        <div className={classes.container}>
            <Paper className={classes.dataEntryPaper}>
                <div className={classes.header}>
                    {i18n.t('Search')}
                </div>

                <SingleSelect
                    onChange={({ selected }) => { choseSelected(selected); }}
                    selected={selectedOption}
                    empty={<div className={classes.customEmpty}>Custom empty component</div>}
                >
                    {
                        Object.values(trackedEntityTypesWithCorrelatedPrograms)
                            // $FlowSuppress https://github.com/facebook/flow/issues/2221
                            .map(({ trackedEntityTypeName, trackedEntityTypeId, programs }) =>
                                // SingleSelect component wont allow us to wrap the SingleSelectOption
                                // in any other element and still make use of the default behaviour.
                                // Therefore we are returning the group title and the
                                // SingleSelectOption in an array.
                                [
                                    <div className={classes.groupTitle} key={trackedEntityTypeId}>{trackedEntityTypeName}</div>,
                                    programs.map(({ programName, programId }) =>
                                        (<SingleSelectOption value={programId} label={programName} />)),
                                ])
                    }
                </SingleSelect>
            </Paper>
        </div>
    </>);
};

export const SearchPage = withStyles(getStyles)(Index);
