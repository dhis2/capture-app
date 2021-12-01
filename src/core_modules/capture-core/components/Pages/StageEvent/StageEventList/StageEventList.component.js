// @flow
import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import type { ComponentType } from 'react';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { Widget } from '../../../Widget';
import { EventWorkingLists } from '../../../WorkingLists/EventWorkingLists';
import { TeiWorkingLists } from '../../../WorkingLists/TeiWorkingLists';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
import type { Props } from './StageEventList.types';

const getStyles = () => ({});

const storeId = 'stageEvents';
const StageEventListPlain = ({ stage, programId, ...passOnProps }) => {
    const { programType } = useProgramInfo(programId);

    const workingListProps = {
        storeId,
        programId,
        programStageId: stage.id,
        ...passOnProps,
    };
    return (<>
        <div data-test="stage-event-list" >
            <Widget
                noncollapsible
                header={<StageEventHeader
                    title={stage?.name}
                    icon={stage?.icon}
                    events={[]}
                />}
            >
                {programType === programTypes.EVENT_PROGRAM && <EventWorkingLists
                    {...workingListProps}
                />}
                {programType === programTypes.TRACKER_PROGRAM && <TeiWorkingLists
                    {...workingListProps}
                />}
            </Widget>
        </div>
    </>);
};

export const StageEventList: ComponentType<$Diff<Props, CssClasses>> = withStyles(
    getStyles,
)(StageEventListPlain);
