// @flow
import type { Element } from 'react';
import { addEventSaveTypes } from '../DataEntry/addEventSaveTypes';

export type InputProps = {|
    onSave: (saveType: $Keys<typeof addEventSaveTypes>) => void,
    onCancel: () => void,
    id: string,
|};

export type Props = {|
    onSave: (saveType: $Keys<typeof addEventSaveTypes>) => void,
    cancelButton: Element<any>,
    ...CssClasses,
|};
