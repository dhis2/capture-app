import React, { type ComponentType, useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles, type WithStyles, createStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import type { ComponentProps } from './RegisterTei.types';
import { withErrorMessageHandler } from '../../../../../HOC';

const getStyles = () => createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 10,
        flexBasis: 0,
        margin: 8,
    },
});

type CardListButtonProps = {
    teiId: string;
    values: Record<string, any>;
    handleOnClick: (teiId: string, values: Record<string, any>) => void;
};

const CardListButton = (({ teiId, values, handleOnClick }: CardListButtonProps) => (
    <Button
        small
        dataTest="view-dashboard-button"
        onClick={() => { handleOnClick(teiId, values); }}
    >
        {i18n.t('Link')}
    </Button>
));

type DialogButtonsProps = {
    onCancel: () => void;
    onSave: () => void;
    trackedEntityName: string | undefined;
};

const DialogButtons = ({ onCancel, onSave, trackedEntityName }: DialogButtonsProps) => (
    <>
        <Button
            onClick={onCancel}
            secondary
        >
            {i18n.t('Cancel')}
        </Button>
        <div style={{ marginLeft: 16 }}>
            <Button
                dataTest="create-as-new-person"
                onClick={onSave}
                primary
            >
                {i18n.t('Save as new {{trackedEntityName}}', {
                    trackedEntityName, interpolation: { escapeValue: false },
                })}
            </Button>
        </div>
    </>
);

type RegisterTeiPlainProps = ComponentProps & WithStyles<typeof getStyles>;

const RegisterTeiPlain = ({
    dataEntryId,
    onLink,
    onCancel,
    onSaveWithoutEnrollment,
    onSaveWithEnrollment,
    onGetUnsavedAttributeValues,
    trackedEntityName,
    trackedEntityTypeId,
    selectedScopeId,
    inheritedAttributes,
    classes,
}: RegisterTeiPlainProps) => {
    const resultsPageSizeContext = useContext(ResultsPageSizeContext) as { resultsPageSize: number };
    const resultsPageSize = resultsPageSizeContext?.resultsPageSize;

    const renderDuplicatesCardActions = useCallback(({ item }: { item: { id: string; values: Record<string, any> } }) => (
        <CardListButton
            teiId={item.id}
            values={item.values}
            handleOnClick={onLink}
        />
    ), [onLink]);

    const renderDuplicatesDialogActions = useCallback((callbackOnCancel: () => void, onSaveArgument: () => void) => (
        <DialogButtons
            onCancel={callbackOnCancel}
            onSave={onSaveArgument}
            trackedEntityName={trackedEntityName}
        />
    ), [trackedEntityName]);

    const ExistingUniqueValueDialogActions = useCallback((props: { teiId: string; attributeValues: Record<string, any> }) => {
        const { teiId, attributeValues } = props;
        return (
            <Button
                dataTest="existing-unique-value-link-tei-button"
                primary
                onClick={() => { onLink(teiId, attributeValues); }}
            >
                {i18n.t('Link')}
            </Button>
        );
    }, [onLink]);

    return (
        <div className={classes.container}>
            <div className={classes.leftContainer}>
                <RegistrationSection
                    trackedEntityTypeId={trackedEntityTypeId}
                />
                <RegisterTeiDataEntry
                    onLink={onLink}
                    onCancel={onCancel}
                    onSaveWithoutEnrollment={onSaveWithoutEnrollment}
                    onSaveWithEnrollment={onSaveWithEnrollment}
                    trackedEntityTypeId={trackedEntityTypeId}
                    onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                    duplicatesReviewPageSize={resultsPageSize}
                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                    renderDuplicatesCardActions={renderDuplicatesCardActions}
                    ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                    inheritedAttributes={inheritedAttributes}
                />
            </div>
            <DataEntryWidgetOutput
                dataEntryId={dataEntryId}
                selectedScopeId={selectedScopeId}
                renderCardActions={(props: { item: { id: string; values: Record<string, any> } }) => {
                    const { item } = props;
                    return <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />;
                }}
            />
        </div>
    );
};

export const RegisterTeiComponent = compose(
    withErrorMessageHandler(),
    withStyles(getStyles),
)(RegisterTeiPlain) as ComponentType<Omit<ComponentProps, 'classes'>>;
