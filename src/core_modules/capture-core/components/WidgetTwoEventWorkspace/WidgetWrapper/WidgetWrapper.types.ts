import type { WithStyles } from '@material-ui/core/styles';
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';
import type { ProgramStage } from '../../../metaData';

type PlainProps = {
    widget: any;
    linkedStage: ProgramStage;
    stage?: ProgramStage;
    type?: typeof WidgetTwoEventWorkspaceWrapperTypes[keyof typeof WidgetTwoEventWorkspaceWrapperTypes];
};

export type Props = PlainProps & WithStyles<typeof import('./WidgetWrapper.container').styles>;
