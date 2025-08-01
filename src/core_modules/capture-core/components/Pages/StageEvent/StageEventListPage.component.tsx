import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { spacersNum } from '@dhis2/ui';
import { compose } from 'redux';
import type { PlainProps } from './StageEventListPage.types';
import { StageEventList } from './StageEventList/StageEventList.component';
import { withErrorMessageHandler } from '../../../HOC';

const getStyles = () => ({
    container: {
        padding: `${spacersNum.dp16}px ${spacersNum.dp24}px`,
    },
});

type Props = PlainProps & WithStyles<typeof getStyles>;

const StageEventListPagePlain = ({ classes, programStage, ...passOnProps }: Props) => (<>
    <div data-test="stage-event-list-page-content" className={classes.container}>
        <StageEventList stage={programStage} {...passOnProps} />
    </div>
</>);

export const StageEventListPageComponent =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(StageEventListPagePlain) as ComponentType<PlainProps>;
