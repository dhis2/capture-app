// @flow
import type { Element } from 'react';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';

export type InputProps = {|
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    id: string,
    hiddenProgramStage: boolean,
    stageName: string,
|};

export type Props = {|
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    cancelButton: Element<any>,
    hiddenProgramStage: boolean,
    stageName: string,
    ...CssClasses,
|};
