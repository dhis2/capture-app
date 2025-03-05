// @flow
import * as React from 'react';
import { Button, ButtonStrip, colors, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { NewTemplateTextField } from './NewTemplateTextField.component';
import { theme } from '../../../../../../styles/theme';

type Props = {
    onSaveTemplate: (name: string) => void,
    onClose: () => void,
};

export const NewTemplateContents = (props: Props) => {
    const { onSaveTemplate, onClose } = props;
    const [name, setName] = React.useState('');
    const [error, setError] = React.useState();

    const nameBlurHandler = React.useCallback(({ value }) => {
        value && setError(undefined);
        setName(value);
    }, []);

    const handleSave = React.useCallback(() => {
        if (!name) {
            setError('Please specify a view name');
            return;
        }
        onSaveTemplate(name);
    }, [name, onSaveTemplate]);

    return (
        <React.Fragment>
            <ModalTitle>{i18n.t('Save As view')}</ModalTitle>
            <ModalContent>
                <div className="input-container">
                    <NewTemplateTextField
                        onBlur={nameBlurHandler}
                        label={i18n.t('View name')}
                        error={!!error}
                        dataTest="view-name"
                        initialFocus
                        required
                        name="viewName"
                    />
                </div>
                <div
                    data-test="view-name-error-message"
                    className="error-message"
                >
                    {error}
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button onClick={handleSave} primary>
                        {i18n.t('Save')}
                    </Button>
                </ButtonStrip>
            </ModalActions>

            <style jsx>{`
                .error-message {
                    padding: 4px;
                    color: ${colors.red500};
                    font-size: ${theme.typography.pxToRem(14)};
                }
                .input-container {
                    width: 100%;
                }
                .button-container {
                    display: flex;
                    justify-content: space-between;
                }
            `}</style>
        </React.Fragment>
    );
};
