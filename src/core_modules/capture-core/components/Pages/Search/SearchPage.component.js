// @flow
import React, { useMemo, useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui-core';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './SearchPage.types';
import { Section, SectionHeaderSimple } from '../../Section';

const getStyles = (theme: Theme) => ({
    container: {
        padding: '10px 24px 24px 24px',
    },
    paper: {
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
    searchDomainSelectorSection: {
        maxWidth: theme.typography.pxToRem(900),
        marginBottom: theme.typography.pxToRem(20),
    },
    searchRow: {
        display: 'flex',
        padding: '8px 0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchRowTitle: {
        flexBasis: 200,
        marginLeft: 16,
    },
    searchRowSelectElement: {
        width: '100%',
        marginRight: 8,
    },
});


const Index = ({ classes, trackedEntityTypesWithCorrelatedPrograms, preselectedProgram }: Props) => {
    const [selectedOption, setSelected] = useState(preselectedProgram);

    return (<>
        <LockedSelector />
        <div className={classes.container}>
            <Paper className={classes.paper}>
                <Section
                    className={classes.searchDomainSelectorSection}
                    header={
                        <SectionHeaderSimple
                            containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                            title={i18n.t('Search')}
                        />
                    }
                >
                    <div className={classes.searchRow}>
                        <div className={classes.searchRowTitle}>Search for</div>
                        <div className={classes.searchRowSelectElement}>
                            <SingleSelect
                                onChange={({ selected }) => { setSelected(selected); }}
                                selected={selectedOption}
                                empty={<div className={classes.customEmpty}>Custom empty component</div>}
                            >
                                {
                                    useMemo(() => Object.values(trackedEntityTypesWithCorrelatedPrograms)
                                        // $FlowFixMe https://github.com/facebook/flow/issues/2221
                                        .map(({ trackedEntityTypeName, trackedEntityTypeId, programs }) =>
                                            // SingleSelect component wont allow us to wrap the SingleSelectOption
                                            // in any other element and still make use of the default behaviour.
                                            // Therefore we are returning the group title and the
                                            // SingleSelectOption in an array.
                                            [
                                                <SingleSelectOption
                                                    value={trackedEntityTypeId}
                                                    label={trackedEntityTypeName}
                                                />,
                                                programs.map(({ programName, programId }) =>
                                                    (<SingleSelectOption value={programId} label={programName} />)),
                                                <div
                                                    className={classes.groupTitle}
                                                    key={trackedEntityTypeId}
                                                >
                                                    --------------------------
                                                </div>,
                                            ],
                                        ),
                                    [
                                        trackedEntityTypesWithCorrelatedPrograms,
                                        classes.groupTitle,
                                    ],
                                    )
                                }
                            </SingleSelect>
                        </div>
                    </div>
                </Section>
            </Paper>
        </div>
    </>);
};

export const SearchPage = withStyles(getStyles)(Index);
