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
import { RegistrationDataEntry } from './RegistrationDataEntry';

const getStyles = ({ typography }) => ({
    container: {
        padding: '8px 24px 16px 24px',
    },
    paper: {
        marginBottom: typography.pxToRem(10),
        padding: typography.pxToRem(10),
    },
    maxWidth: {
        maxWidth: typography.pxToRem(950),
    },
    title: {
        padding: '8px 0 0px 8px',
        fontWeight: 500,
    },
    tetypeContainer: {
        marginTop: typography.pxToRem(16),
    },
    registrationContainer: {
        marginLeft: typography.pxToRem(8),
        marginRight: typography.pxToRem(8),
    },
    selectorTopMargin: {
        margin: typography.pxToRem(16),
    },
    emptySelectionPaperContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
});

export const NEW_TEI_DATA_ENTRY_ID = 'newPageDataEntryId';

const NewPagePlain = ({
    showMessageToSelectOrgUnitOnNewPage,
    showDefaultViewOnNewPage,
    classes,
    currentOrgUnitId,
    currentScopeId,
    newPageStatus,
}: Props) => {
    const { scopeType } = useScopeInfo(currentScopeId);
    const [selectedScopeId, setScopeId] = useState(currentScopeId);
    const titleText = useScopeTitleText(selectedScopeId);

    useEffect(() => {
        setScopeId(currentScopeId);
    }, [scopeType, currentScopeId]);

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

    const handleRegistrationScopeSelection = (id) => {
        setScopeId(id);
    };

    return (<>
        <LockedSelector />

        <div data-test="dhis2-capture-registration-page-content" className={classes.container} >
            {
                newPageStatus === newPageStatuses.DEFAULT &&
                <Paper className={classes.paper}>
                    <div className={classes.maxWidth}>
                        <div className={classes.title} >
                            New {titleText}
                        </div>
                        {
                            (!scopeType || scopeType === scopeTypes.TRACKED_ENTITY_TYPE) &&
                                <div className={classes.tetypeContainer}>
                                    <TrackedEntityTypeSelector onSelect={handleRegistrationScopeSelection} />
                                </div>
                        }
                        <div className={classes.registrationContainer}>
                            <RegistrationDataEntry
                                dataEntryId={NEW_TEI_DATA_ENTRY_ID}
                                selectedScopeId={selectedScopeId}
                            />
                        </div>
                    </div>
                </Paper>
            }

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
