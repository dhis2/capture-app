// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { UserSearch } from './UserSearch.component';
import { Selected } from './Selected.component';
import type { User } from './types';

const getStyles = () => ({
});

type Props = {
    value: ?User | ?string,
    onSet: (user?: User | string) => void,
    classes: Object,
    useUpwardSuggestions?: ?boolean,
    focusOnMount?: ?boolean,
    inputPlaceholderText?: ?string,
    usernameOnlyMode?: boolean,
};

const UserFieldPlain = (props: Props) => {
    const {
        classes,
        value,
        onSet,
        useUpwardSuggestions,
        focusOnMount = false,
        inputPlaceholderText,
        usernameOnlyMode,
    } = props;
    const focusSearchInput = React.useRef(focusOnMount);
    const focusSelectedInput = React.useRef(focusOnMount);

    React.useEffect(() => {
        if (focusSearchInput) {
            focusSearchInput.current = false;
        }
    });

    React.useEffect(() => {
        if (focusSelectedInput) {
            focusSelectedInput.current = false;
        }
    });

    const handleClear = () => {
        onSet();
        focusSearchInput.current = true;
    };

    const handleSet = (user: User) => {
        onSet(usernameOnlyMode ? user.username : user);
        focusSelectedInput.current = true;
    };

    const handleBlur = () => {
        // $FlowExpectedError
        onSet(value);
    };

    if (value) {
        return (
            <Selected
                // $FlowFixMe
                text={usernameOnlyMode ? value : value.name}
                onClear={handleClear}
                // $FlowFixMe[incompatible-type] automated comment
                focusInputOnMount={focusSelectedInput.current}
            />
        );
    }

    return (
        <div onBlur={handleBlur}>
            <UserSearch
                onSet={handleSet}
                inputWrapperClasses={classes}
                // $FlowFixMe[incompatible-type] automated comment
                focusInputOnMount={focusSearchInput.current}
                useUpwardList={useUpwardSuggestions}
                inputPlaceholderText={inputPlaceholderText}
                exitBehaviour="selectBestChoice"
            />
        </div>
    );
};

export const UserField = withStyles(getStyles)(UserFieldPlain);
