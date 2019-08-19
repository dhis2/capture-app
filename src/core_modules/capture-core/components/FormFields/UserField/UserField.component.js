// @flow
import * as React from 'react';
import UserSearch from './UserSearch.component';
import type { User } from './types';

type Props = {
    selectedUser: ?User,
    onSet: (user: User) => void,
};

const UserField = (props: Props) => {
    const { selectedUser, onSet, onSetFocus, onRemoveFocus, ...passOnProps } = props;

    if (selectedUser) {
        return null;
    }

    return (
        <div>
            <UserSearch
                onSetFocus={onSetFocus}
                onRemoveFocus={onRemoveFocus}
                onSet={onSet}
            />
        </div>
    );
};

export default UserField;
