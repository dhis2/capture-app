// @flow
import * as React from 'react';
import { Chip } from '@dhis2/ui-core';
import { TextFieldPlain } from 'capture-ui';
import defaultClasses from './selected.module.css';
import type { User } from './types';

type Props = {
    user: User,
    onClear: () => void,
};

const Selected = (props: Props) => {
    const { user, onClear } = props;

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            onClear();
        }
    };

    return (
        <div
            className={defaultClasses.container}
        >
            <div
                role={'button'}
                className={defaultClasses.inputContainer}
                tabIndex={0}
                onKeyDown={handleKeyDown}
            >
                <TextFieldPlain
                    classes={defaultClasses}
                    value={''}
                    disabled
                />
            </div>
            <div
                className={defaultClasses.chipContainer}
            >
                <Chip
                    onRemove={() => { onClear(); }}
                    onClick={() => { onClear(); }}
                >
                    {user.name}
                </Chip>
            </div>
        </div>
    );
};

export default Selected;
