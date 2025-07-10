import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';
import type { ProgramStage } from '../../../metaData';

export type PlainProps = {
    widget: any;
    linkedStage: ProgramStage;
    stage?: ProgramStage;
    type?: typeof WidgetTwoEventWorkspaceWrapperTypes[keyof typeof WidgetTwoEventWorkspaceWrapperTypes];
};
