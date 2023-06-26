// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { UserSearch } from '../../../../FormFields/UserField/UserSearch.component';

const getStyles = () => ({
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
    onCancel: Function,
    classes: Object,
};

const EditModePlain = (props: Props) => {
    const { onCancel, classes, ...passOnProps } = props;
    return (
        <div
            className={classes.container}
        >
            <div
                className={classes.searchContainer}
            >
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <UserSearch
                    inputWrapperClasses={{}}
                    focusInputOnMount
                    exitBehaviour="doNothing"
                    inputPlaceholderText={i18n.t('Search for user')}
                    {...passOnProps}
                />
            </div>
            <div
                className={classes.buttonContainer}
            >
                <Button
                    onClick={onCancel}
                    small
                >
                    {i18n.t('Cancel')}
                </Button>
            </div>
        </div>
    );
};

export const EditMode = withStyles(getStyles)(EditModePlain);
