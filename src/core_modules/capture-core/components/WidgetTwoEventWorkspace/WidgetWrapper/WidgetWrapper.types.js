// @flow
import { WidgetTwoEventWorkspaceWrapperTypes } from '../index';

type PlainProps = {|
    widget: any,
    type?: $Values<typeof WidgetTwoEventWorkspaceWrapperTypes>,
|};

export type Props = {|
    ...PlainProps,
    ...CssClasses,
|};
