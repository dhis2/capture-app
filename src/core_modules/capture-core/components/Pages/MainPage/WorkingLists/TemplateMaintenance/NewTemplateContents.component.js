// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';
import NewTemplateTextField from './NewTemplateTextField.component';

const getStyles = (theme: Theme) => ({
    error: {
        padding: 4,
        color: 'rgb(211, 47, 47)',
        fontSize: theme.typography.pxToRem(14),
    },
    input: {
        width: '100%',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
});
type Props = {
    onSaveTemplate: (name: string) => void,
    onClose: () => void,
    classes: Object,
};

const NewTemplateContents = (props: Props) => {
    const { onSaveTemplate, onClose, classes } = props;
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState();

    const nameBlurHandler = React.useCallback((event) => {
        const value = event.currentTarget.value;
        value && setError(undefined);
        setName(value);
    }, []);

    const handleSave = React.useCallback(() => {
        if (!name) {
            setError('Please specify a template name');
            return;
        }
        onSaveTemplate(name);
    }, [name, onSaveTemplate]);

    return (
        <React.Fragment>
            <DialogTitle>{i18n.t('Save As template')}</DialogTitle>
            <DialogContent>
                <NewTemplateTextField
                    onBlur={nameBlurHandler}
                    className={classes.input}
                    label={i18n.t('Template name')}
                    error={!!error}
                    initialFocus
                />
                <div
                    data-test="template-name-error-message"
                    className={classes.error}
                >
                    {error}
                </div>
            </DialogContent>
            <DialogActions
                className={classes.buttonContainer}
            >
                <Button onClick={onClose}>
                    {i18n.t('Cancel')}
                </Button>
                <Button onClick={handleSave} primary>
                    {i18n.t('Save')}
                </Button>
            </DialogActions>
        </React.Fragment>
    );
};

export default withStyles(getStyles)(NewTemplateContents);
