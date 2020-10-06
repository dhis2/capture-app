// @flow
import React from 'react';
import { compose } from 'redux';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { LockedSelector } from '../../LockedSelector';
import type { ContainerProps, Props } from './NewPage.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../HOC';

const getStyles = () => ({
    container: {
        padding: '10px 24px 24px 24px',
    },
});

const NewPagePlain = ({ classes }: Props & CssClasses) => (<>
    <LockedSelector />
    <div data-test="dhis2-capture-search-page-content" className={classes.container} >
        Hello from the new page
    </div>
</>);

export const NewPageComponent: ComponentType<ContainerProps> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(NewPagePlain);
