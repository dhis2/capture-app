import React, { type ComponentType } from 'react';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
import { Widget } from '../../../Widget';
import type { PlainProps } from './StageEventList.types';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingLists } from '../../../WorkingLists/EventWorkingLists';
import { TrackerWorkingLists } from '../../../WorkingLists/TrackerWorkingLists';

const storeId = 'stageEvents';

const StageEventListPlain = ({ stage, programId, ...passOnProps }: PlainProps) => {
    const { programType } = useProgramInfo(programId);

    const workingListProps = {
        storeId,
        programId,
        programStageId: stage?.id,
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
                {programType === programTypes.TRACKER_PROGRAM && <TrackerWorkingLists
                    {...workingListProps}
                />}
            </Widget>
        </div>
    </>);
};

export const StageEventList = StageEventListPlain as ComponentType<PlainProps>;
