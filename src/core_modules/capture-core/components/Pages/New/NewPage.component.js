// @flow
import React, { useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import i18n from '@dhis2/d2-i18n';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './NewPage.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { newPageStatuses } from './NewPage.constants';
import { InefficientSelectionsMessage } from '../../InefficientSelectionsMessage';

const getStyles = () => ({
    container: {
        padding: '10px 24px 16px 24px',
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
    newPageStatus,
}: Props) => {
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

    return (<>
        <LockedSelector />
        <div data-test="dhis2-capture-search-page-content" className={classes.container} >
            {
                newPageStatus === newPageStatuses.DEFAULT &&
                <div>Default view</div>
            }

        </div>
        {
            newPageStatus === newPageStatuses.WITHOUT_ORG_UNIT_SELECTED &&
                <InefficientSelectionsMessage
                    message={i18n.t('Choose in which organisation unit you want to start creating')}
                />
        }
    </>);
};

export const NewPageComponent: ComponentType<ContainerProps> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(NewPagePlain);
