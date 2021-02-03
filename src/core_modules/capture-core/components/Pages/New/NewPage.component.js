// @flow
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './NewPage.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { newPageStatuses } from './NewPage.constants';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { RegistrationDataEntry } from './RegistrationDataEntry';
import { NoWriteAccessMessage } from '../../NoWriteAccessMessage';
import { IncompleteSelectionsMessage } from '../../IncompleteSelectionsMessage';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
});

export const NEW_TEI_DATA_ENTRY_ID = 'newPageDataEntryId';

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
        <LockedSelector pageToPush="new" />
        <div data-test="dhis2-capture-registration-page-content" className={classes.container} >
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
                                    dataTest="dhis2-capture-new-page-cancel-button"
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
                                        {i18n.t('Choose the {{missingCategories}} to start reporting', { missingCategories })}
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
