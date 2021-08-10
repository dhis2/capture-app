// @flow
import React from 'react';
import type { ComponentType } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
import { Widget } from '../../../Widget';
import type { Props } from './StageEventList.types';
import { EventWorkingLists } from '../../../WorkingLists/EventWorkingLists';


const getStyles = () => ({});

const StageEventListPlain = ({ stage, programId, orgUnitId }) => (<>
    <div data-test="stage-event-list" >
        <Widget
            noncollapsible
            header={<StageEventHeader
                title={stage.name}
                icon={stage.icon}
                events={[]}
            />}
        >
            <EventWorkingLists
                storeId="stageEvents"
                programId={programId}
                programStageId={stage.id}
                orgUnitId={orgUnitId}
            />
        </Widget>
    </div>
</>);

export const StageEventList: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListPlain);
