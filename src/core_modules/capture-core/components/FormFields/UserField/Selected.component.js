// @flow
import * as React from 'react';
import { Chip } from '@dhis2/ui';
import { TextFieldPlain } from 'capture-ui';
import defaultClasses from './selected.module.css';

type Props = {
    text: string,
    onClear: () => void,
    focusInputOnMount: boolean,
};

const Selected = (props: Props) => {
    const { text, onClear, focusInputOnMount } = props;
    const inputDomElement = React.useRef();

    React.useEffect(() => {
        if (focusInputOnMount) {
            inputDomElement.current && inputDomElement.current.focus();
        }
    }, [focusInputOnMount]);

    const handleKeyDown = (event) => {
        if ([8, 46].includes(event.keyCode)) {
            onClear();
        }
    };

    return (
        <div
            className={defaultClasses.container}
        >
            <div
                ref={(instance) => { inputDomElement.current = instance; }}
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
                    {text}
                </Chip>
            </div>
        </div>
    );
};

export default Selected;
