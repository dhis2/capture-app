// @flow
import React from 'react';
import { useDispatch } from 'react-redux';
import { WidgetEventEdit as WidgetEventEditComponent } from './WidgetEventEdit.component';
import type { Props } from './widgetEventEdit.types';
import { startShowEditEventDataEntry } from './WidgetEventEdit.actions';

export const WidgetEventEdit = ({ programStage, mode }: Props) => {
    const dispatch = useDispatch();

    return (
        <WidgetEventEditComponent
            programStage={programStage}
            mode={mode}
            onEdit={() => dispatch(startShowEditEventDataEntry())}
        />
    );
};
