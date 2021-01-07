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
import { InefficientSelectionsMessage } from '../../InefficientSelectionsMessage';
import { useScopeInfo } from '../../../hooks/useScopeInfo';
import { RegistrationDataEntry } from './RegistrationDataEntry';
import { programCollection } from '../../../metaDataMemoryStores';

const getStyles = () => ({
    container: {
        padding: '24px 24px 16px 24px',
    },
});

export const NEW_TEI_DATA_ENTRY_ID = 'newPageDataEntryId';

const NewPagePlain = ({
    showMessageToSelectOrgUnitOnNewPage,
    showMessageToSelectProgramPartnerOnNewPage,
    showDefaultViewOnNewPage,
    handleMainPageNavigation,
    classes,
    currentScopeId,
    newPageStatus,
    partnerSelectionIncomplete,
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
        } else if (partnerSelectionIncomplete) {
            showMessageToSelectProgramPartnerOnNewPage();
        } else {
            showDefaultViewOnNewPage();
        }
    },
    [
        partnerSelectionIncomplete,
        orgUnitSelectionIncomplete,
        showMessageToSelectOrgUnitOnNewPage,
        showMessageToSelectProgramPartnerOnNewPage,
        showDefaultViewOnNewPage,
    ]);

    return (<>
        <LockedSelector />
        <div data-test="dhis2-capture-registration-page-content" className={classes.container} >
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
                    <InefficientSelectionsMessage
                        message={i18n.t('Choose a registering unit to start reporting')}
                    />
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
                    const { categoryCombination } = programCollection.get(currentScopeId) || {};
                    const { name = 'a program category' } = categoryCombination || { };
                    return (
                        <InefficientSelectionsMessage
                            message={i18n.t('Choose {{name}} to start reporting', { name })}
                        />
                    );
                })()
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
