import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { UserSearch } from './UserSearch.component';
import { Selected } from './Selected.component';
import type { User } from './types';

const getStyles = () => ({
});

type Props = {
    value: User | string | null | undefined;
    onSet: (user?: User | string) => void;
    classes: any;
    useUpwardSuggestions?: boolean | null | undefined;
    focusOnMount?: boolean | null | undefined;
    inputPlaceholderText?: string | null | undefined;
    usernameOnlyMode?: boolean;
} & WithStyles<typeof getStyles>;

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
        onSet(value as any);
    };

    if (value) {
        return (
            <Selected
                text={usernameOnlyMode ? value as string : (value as User).name}
                onClear={handleClear}
                focusInputOnMount={focusSelectedInput.current || false}
            />
        );
    }

    return (
        <div onBlur={handleBlur}>
            <UserSearch
                onSet={handleSet}
                inputWrapperClasses={classes}
                focusInputOnMount={focusSearchInput.current}
                useUpwardList={useUpwardSuggestions}
                inputPlaceholderText={inputPlaceholderText}
                exitBehaviour="selectBestChoice"
            />
        </div>
    );
};

export const UserField = withStyles(getStyles)(UserFieldPlain);
