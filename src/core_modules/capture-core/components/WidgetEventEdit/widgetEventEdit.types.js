// @flow

import type { ProgramStage } from '../../metaData';
import type { CategoryOption } from '../FormFields/New/CategoryOptions/CategoryOptions.types';

export type Props = {|
    programStage: ProgramStage,
    eventStatus?: string,
    onGoBack: () => void,
    onCancelEditEvent: () => void,
    onHandleScheduleSave: (eventData: Object) =>void,
    orgUnitId: string,
    programId: string,
    enrollmentId: string,
    teiId: string,
    initialScheduleDate?: string,
    selectedCategories?: ?{ [categoryId: string]: CategoryOption },
    ...CssClasses,
|};
