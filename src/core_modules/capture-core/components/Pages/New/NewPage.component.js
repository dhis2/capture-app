// @flow
import React, { useEffect } from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './NewPage.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';
import { newPageStatuses } from './NewPage.constants';

const getStyles = () => ({
    container: {
        padding: '10px 24px 24px 24px',
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

            {
                newPageStatus === newPageStatuses.WITHOUT_ORG_UNIT_SELECTED &&
                <div>please select org unit</div>
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
