import React, { type ComponentType } from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { StageEventHeader } from './StageEventHeader/StageEventHeader.component';
import { Widget } from '../../../Widget';
import type { PlainProps } from './StageEventList.types';
import { useProgramInfo, programTypes } from '../../../../hooks/useProgramInfo';
import { EventWorkingLists } from '../../../WorkingLists/EventWorkingLists';
import { TrackerWorkingLists } from '../../../WorkingLists/TrackerWorkingLists';

const getStyles = () => ({});

const storeId = 'stageEvents';

type Props = PlainProps & WithStyles<typeof getStyles>;

const StageEventListPlain = ({ stage, programId, ...passOnProps }: Props) => {
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

export const StageEventList = withStyles(
    getStyles,
)(StageEventListPlain) as ComponentType<PlainProps>;
