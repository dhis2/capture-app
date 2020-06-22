// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui-core';
import { LockedSelector } from '../../LockedSelector';
import type { Props } from './SearchPage.types';
import { Section, SectionHeaderSimple } from '../../Section';
import Button from '../../Buttons/Button.component';

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
    searchButtonContainer: {
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        alignItems: 'center',
    },
});


const Index = ({ classes, trackedEntityTypesWithCorrelatedPrograms, preselectedProgram, programs }: Props) => {
    const [selectedOption, choseSelected] = useState(preselectedProgram);

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
                                                <div
                                                    className={classes.groupTitle}
                                                    key={trackedEntityTypeId}
                                                >
                                                    {trackedEntityTypeName}
                                                </div>,
                                                programs.map(({ programName, programId }) =>
                                                    (<SingleSelectOption value={programId} label={programName} />)),
                                            ])
                                }
                            </SingleSelect>
                        </div>
                    </div>
                </Section>

                {
                    selectedOption.value && programs[selectedOption.value].searchGroups
                        .filter(sg => sg.unique)
                        .map((sg) => {
                            const name = sg.searchForm.getElements()[0].formName;
                            return (
                                <Section
                                    className={classes.searchDomainSelectorSection}
                                    header={
                                        <SectionHeaderSimple
                                            containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                                            title={i18n.t('Search {{name}}', { name })}
                                        />
                                    }
                                >
                                    <div className={classes.searchRow}>
                                        <div className={classes.searchRowTitle}>Search for</div>
                                        <div className={classes.searchRowSelectElement}>
                                            FORM GOES HERE
                                        </div>
                                    </div>
                                    <div className={classes.searchButtonContainer}>
                                        <Button onClick={() => {}}>
                                            Find by {name}
                                        </Button>
                                    </div>
                                </Section>
                            );
                        })
                }
            </Paper>
        </div>
    </>);
};

export const SearchPage = withStyles(getStyles)(Index);
