// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { UserSearch, type UserFormField } from '../FormFields/UserField';

const styles = () => ({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    searchContainer: {
        flexGrow: 1,
        flexShrink: 1,
        paddingRight: 5,
    },
    buttonContainer: {
        flexGrow: 0,
        flexShrink: 0,
    },
});

type Props = {
    onCancel: () => {},
    onSet: (user: UserFormField) => void,
    ...CssClasses,
};

const EditModePlain = (props: Props) => {
    const { onCancel, onSet, classes } = props;
    return (
        <div className={classes.container}>
            <div className={classes.searchContainer}>
                <UserSearch
                    inputWrapperClasses={{}}
                    focusInputOnMount
                    exitBehaviour="doNothing"
                    inputPlaceholderText={i18n.t('Search for user')}
                    onSet={onSet}
                />
            </div>
            <div className={classes.buttonContainer}>
                <Button onClick={onCancel} small>
                    {i18n.t('Cancel')}
                </Button>
            </div>
        </div>
    );
};

export const EditMode = withStyles(styles)(EditModePlain);
