import React from 'react';
import type { Props } from './WidgetAssignee.types';
import { WidgetAssigneeComponent } from './WidgetAssignee.component';
import { useUserAvatar, useAssigneeMutation } from './hooks';

const WidgetAssigneeWithHooks = (props: Props) => {
    const { assignee, readOnly, getSaveContext, onSave, onSaveError } = props;
    const { avatarId, isLoading } = useUserAvatar(assignee?.id);
    const onSet = useAssigneeMutation({ assignee, getSaveContext, onSave, onSaveError });

    if (isLoading) {
        return null;
    }

    return (
        <WidgetAssigneeComponent
            assignee={assignee}
            readOnly={readOnly}
            avatarId={avatarId}
            onSet={onSet}
        />
    );
};

export const WidgetAssignee = (props: Props) => {
    if (!props.enabled) {
        return null;
    }

    return <WidgetAssigneeWithHooks {...props} />;
};
