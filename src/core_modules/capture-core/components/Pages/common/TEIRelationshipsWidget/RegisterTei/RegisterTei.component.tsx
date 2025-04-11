import React, { useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext, type InitialValueOfResultsPageSizeContext } from '../../../shared-contexts';
import { withErrorMessageHandler } from '../../../../../HOC';
import { ComponentPropsPlain, CardListButtonProps, DialogButtonsProps } from './RegisterTei.types';

const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 10,
        flexBasis: 0,
        margin: 8,
    },
};

export type ComponentProps = ComponentPropsPlain & WithStyles<keyof typeof styles>;

const CardListButton = (({ teiId, values, handleOnClick }: CardListButtonProps) => (
    <Button
        small
        dataTest="view-dashboard-button"
        onClick={() => { handleOnClick(teiId, values); }}
    >
        {i18n.t('Link')}
    </Button>
));

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

type RegisterTeiPlainProps = ComponentProps;

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
    const { resultsPageSize } = useContext(ResultsPageSizeContext) as InitialValueOfResultsPageSizeContext;

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

    const ExistingUniqueValueDialogActions = useCallback((props: { teiId: string; attributeValues: Record<string, any> }) => (
        <Button
            dataTest="existing-unique-value-link-tei-button"
            primary
            onClick={() => { onLink(props.teiId, props.attributeValues); }}
        >
            {i18n.t('Link')}
        </Button>
    ), [onLink]);

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
                renderCardActions={(props: { item: { id: string; values: Record<string, any> } }) =>
                    <CardListButton teiId={props.item.id} values={props.item.values} handleOnClick={onLink} />
                }
            />
        </div>
    );
};

export const RegisterTeiComponent = compose<React.ComponentType<Omit<ComponentProps, keyof WithStyles<keyof typeof styles>>>>(
    withErrorMessageHandler(),
    withStyles(styles as any),
)(RegisterTeiPlain);
