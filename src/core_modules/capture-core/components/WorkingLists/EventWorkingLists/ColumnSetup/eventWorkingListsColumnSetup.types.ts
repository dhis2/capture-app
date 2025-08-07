import { Program, ProgramStage } from '../../../../metaData';
import type { CustomColumnOrder } from '../../WorkingListsCommon';
import type { EventWorkingListsColumnConfigs } from '../../EventWorkingListsCommon';
import type { EventWorkingListsReduxOutputProps } from '../ReduxProvider';

type ExtractedProps = {
    program: Program,
    programStage: ProgramStage,
    customColumnOrder?: CustomColumnOrder,
    onLoadView: any,
    onUpdateList: any,
};

// had to add customColumnOrder as a non optional type or else it would not be removed. Also, if customColumnOrder is
// added as non optional to the ExtractedProps only (and not to EventWorkingListsReduxOutputProps),
// flow complaints about one them being optional.

type RestProps = Omit<EventWorkingListsReduxOutputProps & { customColumnOrder: CustomColumnOrder },
    keyof (ExtractedProps & { customColumnOrder: CustomColumnOrder })>;

export type Props = RestProps & ExtractedProps;

export type EventWorkingListsColumnSetupOutputProps = RestProps & {
    program: Program,
    programStageId: string,
    columns: EventWorkingListsColumnConfigs,
    defaultColumns: EventWorkingListsColumnConfigs,
    onLoadView: any,
    onUpdateList: any,
};
