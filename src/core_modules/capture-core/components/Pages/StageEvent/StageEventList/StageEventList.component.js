// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
import { Widget } from '../../../Widget';
import type { Props } from './StageEventList.types';

const getStyles = () => ({});

const StageEventListPlain = ({ stage }) => (<>
    <div data-test="stage-event-list" >
        <Widget
            noncollapsible
            header={<StageEventHeader
                title={stage?.name}
                icon={stage?.icon}
                events={[]}
            />}
        >
            <p>Stage event Placeholder Text</p>
        </Widget>
    </div>
</>);

export const StageEventList: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListPlain);
