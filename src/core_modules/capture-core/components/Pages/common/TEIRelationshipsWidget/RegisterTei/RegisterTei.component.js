// @flow
import React, { type ComponentType, useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext } from '../../../shared-contexts';
import type { ComponentProps } from './RegisterTei.types';
import { withErrorMessageHandler } from '../../../../../HOC';

const getStyles = () => ({
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

const CardListButton = (({ teiId, values, handleOnClick }) => (
    <Button
        small
        dataTest="view-dashboard-button"
        onClick={() => { handleOnClick(teiId, values); }}
    >
        {i18n.t('Link')}
    </Button>
));

const DialogButtons = ({ onCancel, onSave, trackedEntityName }) => (
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
}: ComponentProps) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const renderDuplicatesCardActions = useCallback(({ item }) => (
        <CardListButton
            teiId={item.id}
            values={item.values}
            handleOnClick={onLink}
        />
    ), [onLink]);

    const renderDuplicatesDialogActions = useCallback((callbackOnCancel, onSaveArgument) => (
        <DialogButtons
            onCancel={callbackOnCancel}
            onSave={onSaveArgument}
            trackedEntityName={trackedEntityName}
        />
    ), [trackedEntityName]);

    const ExistingUniqueValueDialogActions = useCallback(({ teiId, attributeValues }) => (
        <Button
            dataTest="existing-unique-value-link-tei-button"
            primary
            onClick={() => { onLink(teiId, attributeValues); }}
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
                renderCardActions={({ item }) =>
                    <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />
                }
            />
        </div>
    );
};

export const RegisterTeiComponent: ComponentType<$Diff<ComponentProps, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(RegisterTeiPlain);
