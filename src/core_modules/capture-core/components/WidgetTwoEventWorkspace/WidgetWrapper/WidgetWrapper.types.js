// @flow
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';
import type { ProgramStage } from '../../../metaData';

type PlainProps = {|
    widget: any,
    linkedStage: ProgramStage,
    stage?: ProgramStage,
    type?: $Values<typeof WidgetTwoEventWorkspaceWrapperTypes>,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};
