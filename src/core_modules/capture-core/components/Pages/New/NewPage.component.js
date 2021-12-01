// @flow
import { compose } from 'redux';
import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';
import { LockedSelector } from '../../LockedSelector';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { RegistrationDataEntry } from './RegistrationDataEntry';
import type { ContainerProps, Props } from './NewPage.types';
import { newPageStatuses } from './NewPage.constants';
import { cleanUpDataEntry } from './NewPage.actions';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
});

export const NEW_TEI_DATA_ENTRY_ID = 'newPageDataEntryId';
export const NEW_SINGLE_EVENT_DATA_ENTRY_ID = 'singleEvent';
export const NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID = 'relationship';

const NewPagePlain = ({
    showMessageToSelectOrgUnitOnNewPage,
    showMessageToSelectProgramCategoryOnNewPage,
    showDefaultViewOnNewPage,
    handleMainPageNavigation,
    classes,
    currentScopeId,
    newPageStatus,
    writeAccess,
    programCategorySelectionIncomplete,
    missingCategoriesInProgramSelection,
    orgUnitSelectionIncomplete,
    isUserInteractionInProgress,
}: Props) => {
    const { scopeType } = useScopeInfo(currentScopeId);
    const [selectedScopeId, setScopeId] = useState(currentScopeId);

    useEffect(() => {
        setScopeId(currentScopeId);
    }, [scopeType, currentScopeId]);

    useEffect(() => {
        if (orgUnitSelectionIncomplete) {
            showMessageToSelectOrgUnitOnNewPage();
        } else if (programCategorySelectionIncomplete) {
            showMessageToSelectProgramCategoryOnNewPage();
        } else {
            showDefaultViewOnNewPage();
        }
    },
    [
        programCategorySelectionIncomplete,
        orgUnitSelectionIncomplete,
        showMessageToSelectOrgUnitOnNewPage,
        showMessageToSelectProgramCategoryOnNewPage,
        showDefaultViewOnNewPage,
    ]);

    return (<>
        <LockedSelector
            pageToPush="new"
            isUserInteractionInProgress={isUserInteractionInProgress}
            customActionsOnProgramIdReset={[
                cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID),
            ]}
            customActionsOnOrgUnitIdReset={[
                cleanUpDataEntry(NEW_TEI_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_SINGLE_EVENT_DATA_ENTRY_ID),
                cleanUpDataEntry(NEW_RELATIONSHIP_EVENT_DATA_ENTRY_ID),
            ]}
        />
        <div data-test="registration-page-content" className={classes.container} >
            {
                !writeAccess ?
                    <NoWriteAccessMessage
                        title={i18n.t('New')}
                        message={i18n.t("You don't have access to create an event in the current selections")}
                    />
                    :
                    <>
                        {
                            newPageStatus === newPageStatuses.DEFAULT &&
                            <RegistrationDataEntry
                                dataEntryId={NEW_TEI_DATA_ENTRY_ID}
                                selectedScopeId={selectedScopeId}
                                setScopeId={setScopeId}
                            />
                        }

                        {
                            newPageStatus === newPageStatuses.WITHOUT_ORG_UNIT_SELECTED &&
                            <>
                                <IncompleteSelectionsMessage>
                                    {i18n.t('Choose a registering unit to start reporting')}
                                </IncompleteSelectionsMessage>
                                <Button
                                    dataTest="new-page-cancel-button"
                                    onClick={handleMainPageNavigation}
                                >
                                    {i18n.t('Cancel')}
                                </Button>
                            </>
                        }

                        {
                            newPageStatus === newPageStatuses.WITHOUT_PROGRAM_CATEGORY_SELECTED &&
                            (() => {
                                const missingCategories = missingCategoriesInProgramSelection.reduce((acc, { name }, index) => {
                                    if ((index + 1 === missingCategoriesInProgramSelection.length)) {
                                        return `${acc} ${name} ${missingCategoriesInProgramSelection.length > 1 ? 'categories' : 'category'}`;
                                    }
                                    return `${acc} ${name},`;
                                }, '');

                                return (
                                    <IncompleteSelectionsMessage>
                                        {i18n.t('Choose the {{missingCategories}} to start reporting', {
                                            missingCategories, interpolation: { escapeValue: false },
                                        })}
                                    </IncompleteSelectionsMessage>
                                );
                            })()
                        }

                    </>
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
