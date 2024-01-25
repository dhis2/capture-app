// @flow
import React, { useState } from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, ButtonStrip, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import type { Assignee } from './WidgetAssignee.types';
import { UserField } from '../FormFields/UserField';

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
        marginTop: spacers.dp8,
    },
});

type Props = {
    assignee: Assignee | null,
    onCancel: () => {},
    onSet: (user: Assignee | null) => void,
    ...CssClasses,
};

const EditModePlain = (props: Props) => {
    const { onCancel, onSet, assignee, classes } = props;
    const [tempUser, setTempUser] = useState(assignee);

    const onHandleSet = (user) => {
        setTempUser(user);
    };

    return (
        <div className={classes.container}>
            <div className={classes.searchContainer}>
                <UserField
                    inputPlaceholderText={i18n.t('Search for user')}
                    value={tempUser}
                    inputWrapperClasses={{}}
                    focusInputOnMount
                    exitBehaviour="doNothing"
                    onSet={onHandleSet}
                />
                <ButtonStrip className={classes.buttonContainer}>
                    <Button onClick={() => onSet(tempUser)} small primary dataTest="widget-assignee-save">
                        {i18n.t('Save')}
                    </Button>
                    <Button onClick={onCancel} small secondary>
                        {i18n.t('Cancel')}
                    </Button>
                </ButtonStrip>
            </div>
        </div>
    );
};

export const EditMode = withStyles(styles)(EditModePlain);
