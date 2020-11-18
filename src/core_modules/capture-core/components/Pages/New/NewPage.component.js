// @flow
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper/Paper';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './NewPage.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { newPageStatuses } from './NewPage.constants';
import { InefficientSelectionsMessage } from '../../InefficientSelectionsMessage';
import { TrackedEntityTypeSelector } from '../../TrackedEntityTypeSelector';
import { scopeTypes } from '../../../metaData';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { useScopeTitleText } from '../../../hooks/useScopeTitleText';

const getStyles = ({ typography }) => ({
    container: {
        padding: '10px 24px 16px 24px',
    },
    paper: {
        marginBottom: typography.pxToRem(10),
        padding: typography.pxToRem(10),
    },
    maxWidth: {
        maxWidth: typography.pxToRem(950),
    },
    title: {
        padding: '10px 0 0px 10px',
        fontWeight: 500,
        marginBottom: typography.pxToRem(16),
    },
    emptySelectionPaperContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
});

const NewPagePlain = ({
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    classes,
    currentOrgUnitId,
    currentProgramId,
    newPageStatus,
}: Props) => {
    const { scopeType } = useScopeInfo(currentProgramId);
    const [selectedScopeType, setScopeType] = useState(scopeType);
    const [selectedScopeId, setScopeId] = useState(currentProgramId);
    const titleText = useScopeTitleText(selectedScopeId);

    useEffect(() => {
        setScopeId(currentProgramId);
        setScopeType(scopeType);
    }, [scopeType, currentProgramId]);


    useEffect(() => {
        if (!currentOrgUnitId) {
            showMessageToSelectOrgUnitOnNewPage();
        } else {
            showDefaultViewOnNewPage();
        }
    },
    [
        showMessageToSelectOrgUnitOnNewPage,
        showDefaultViewOnNewPage,
        currentOrgUnitId,
    ]);

    const handleRegistrationScopeSelection = (id, type) => {
        setScopeId(id);
        setScopeType(type);
    };


    return (<>
        <LockedSelector />

        <div data-test="dhis2-capture-registration-page-content" className={classes.container} >
            <Paper className={classes.paper}>
                <div className={classes.maxWidth}>
                    <div className={classes.title} >
                        New {titleText}
                    </div>

                    {
                        newPageStatus === newPageStatuses.DEFAULT &&
                        <>
                            {
                                (!selectedScopeType || selectedScopeType === scopeTypes.TRACKED_ENTITY_TYPE) &&
                                <TrackedEntityTypeSelector
                                    onSelect={handleRegistrationScopeSelection}
                                    selectedSearchScopeId={selectedScopeId}
                                />
                            }

                        </>
                    }
                </div>
            </Paper>
            {
                newPageStatus === newPageStatuses.WITHOUT_ORG_UNIT_SELECTED &&
                <InefficientSelectionsMessage
                    message={i18n.t('Choose a registering unit to start reporting')}
                />
            }
        </div>
    </>);
};

export const NewPageComponent: ComponentType<ContainerProps> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(NewPagePlain);
