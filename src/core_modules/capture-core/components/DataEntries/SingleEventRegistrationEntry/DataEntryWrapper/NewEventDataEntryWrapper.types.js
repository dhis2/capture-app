// @flow
import type { ProgramStage, RenderFoundation } from '../../../../metaData';

export type PlainProps = {|
    ...CssClasses,
    ...PlainProps,
|}

export type Props = {|
    dataEntryHasChanges: boolean,
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
|}

export type StateProps = {|
    dataEntryHasChanges: boolean,
    formHorizontal: ?boolean,
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
|}

export type ContainerProps = {|
|};

export type MapStateToProps = (ReduxState, ContainerProps) => StateProps;
