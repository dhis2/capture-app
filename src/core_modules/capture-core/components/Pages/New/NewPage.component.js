// @flow
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import { useHistory } from 'react-router';
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
import { urlArguments } from '../../../utils/url';

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
    classes,
    currentScopeId,
    newPageStatus,
    partnerSelectionIncomplete,
    orgUnitSelectionIncomplete,
}: Props) => {
    const { scopeType } = useScopeInfo(currentScopeId);
    const [selectedScopeId, setScopeId] = useState(currentScopeId);
    const titleText = useScopeTitleText(selectedScopeId);
    const history = useHistory();

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

    const handleMainPageNavigation = () => {
        history.push(`/${urlArguments({ orgUnitId: currentOrgUnitId, programId: currentScopeId })}`);
    };


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
                newPageStatus === newPageStatuses.WITHOUT_PROGRAM_PARTNER_SELECTED &&
                <InefficientSelectionsMessage
                    message={i18n.t('Choose a partner to start reporting')}
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
