// @flow
import type { Element } from 'react';
import { typeof addEventSaveTypes } from '../DataEntry/addEventSaveTypes';

export type InputProps = {|
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    onCancel: () => void,
    isLoading: ?boolean,
    cancelButtonIsDisabled?: boolean,
    id: string,
|};

export type Props = {|
    onSave: (saveType: $Keys<addEventSaveTypes>) => void,
    cancelButton: Element<any>,
    isLoading: ?boolean,
    ...CssClasses,
|};
