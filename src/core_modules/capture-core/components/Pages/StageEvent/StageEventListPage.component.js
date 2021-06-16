// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { spacersNum } from '@dhis2/ui';
import { compose } from 'redux';
import type { Props } from './StageEventListPage.types';
import { StageEventListComponent } from './StageEventList/StageEventList.component';
import { withErrorMessageHandler } from '../../../HOC';

const getStyles = () => ({
    container: {
        padding: `${spacersNum.dp16}px ${spacersNum.dp24}px`,
    },
});

const StageEventListPagePlain = ({ classes, programId, programStage, orgUnitId }) => (<>
    <div data-test="stage-event-list-page-content" className={classes.container}>
        <StageEventListComponent stage={programStage} programId={programId} orgUnitId={orgUnitId} />
    </div>
</>);

export const StageEventListPageComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(StageEventListPagePlain);
