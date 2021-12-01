// @flow
import { spacersNum } from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import type { ComponentType } from 'react';
import { compose } from 'redux';
import { withErrorMessageHandler } from '../../../HOC';
import { StageEventList } from './StageEventList/StageEventList.component';
import type { Props } from './StageEventListPage.types';

const getStyles = () => ({
    container: {
        padding: `${spacersNum.dp16}px ${spacersNum.dp24}px`,
    },
});

const StageEventListPagePlain = ({ classes, programStage, ...passOnProps }) => (<>
    <div data-test="stage-event-list-page-content" className={classes.container}>
        <StageEventList stage={programStage} {...passOnProps} />
    </div>
</>);

export const StageEventListPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(StageEventListPagePlain);
