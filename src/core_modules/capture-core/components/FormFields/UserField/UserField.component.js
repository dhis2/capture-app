// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Search from './Search.component';
import Selected from './Selected.component';
import type { User } from './types';

const getStyles = (theme: Theme) => ({
    inputWrapperFocused: {
        border: `2px solid ${theme.palette.primary.light}`,
        borderRadius: '5px',
    },
    inputWrapperUnfocused: {
        padding: 2,
    },
});

type Props = {
    value: ?User,
    onSet: (user?: User) => void,
    classes: Object,
};

const UserField = (props: Props) => {
    const { classes, value, onSet } = props;
    const focusSearchInput = React.useRef(false);
    const focusSelectedInput = React.useRef(false);

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
        onSet(user);
        focusSelectedInput.current = true;
    };

    if (value) {
        return (
            <Selected
                user={value}
                onClear={handleClear}
                focusInputOnMount={focusSelectedInput.current}
            />
        );
    }

    return (
        <div>
            <Search
                onSet={handleSet}
                inputWrapperClasses={classes}
                focusInputOnMount={focusSearchInput.current}
                exitBehaviour="selectBestChoice"
            />
        </div>
    );
};

export default withStyles(getStyles)(UserField);
