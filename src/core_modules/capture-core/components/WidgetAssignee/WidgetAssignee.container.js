// @flow
import React from 'react';
import { useDispatch } from 'react-redux';
import { batchActions } from 'redux-batched-actions';
import type { Props } from './WidgetAssignee.types';
import { WidgetAssigneeComponent } from './WidgetAssignee.component';
import { saveAssignee, setAssignee } from './assignee.actions';
import type { UserFormField } from '../FormFields/UserField';

export const WidgetAssignee = (props: Props) => {
    const dispatch = useDispatch();
    const { programStage, assignee, eventAccess, onGetSaveContext } = props;

    if (!programStage?.enableUserAssignment) {
        return null;
    }

    const onSet = (newAssignee: UserFormField) => {
        const { eventId, events, assignedUser } = onGetSaveContext(newAssignee);
        const serverData = { events };

        dispatch(
            batchActions([
                setAssignee(eventId, serverData, newAssignee),
                saveAssignee({ eventId, serverData, assignee, assignedUser }),
            ]),
        );
    };

    return <WidgetAssigneeComponent assignee={assignee} eventAccess={eventAccess} onSet={onSet} />;
};
