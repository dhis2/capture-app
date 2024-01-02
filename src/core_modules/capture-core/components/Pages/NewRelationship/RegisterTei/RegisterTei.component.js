// @flow
import React, { type ComponentType, useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext } from '../../shared-contexts';
import type { Props } from './RegisterTei.types';
import { withErrorMessageHandler } from '../../../../HOC';

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
    itemId,
    onLink,
    onSave,
    onCancel,
    onGetUnsavedAttributeValues,
    trackedEntityName,
    newRelationshipProgramId,
    classes,
}: Props) => {
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

    const handleSave = useCallback(() => {
        onSave(itemId, dataEntryId);
    }, [onSave, itemId, dataEntryId]);

    return (
        <div className={classes.container}>
            <div className={classes.leftContainer}>
                <RegistrationSection />
                <RegisterTeiDataEntry
                    onLink={onLink}
                    onSave={handleSave}
                    onCancel={onCancel}
                    onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                    duplicatesReviewPageSize={resultsPageSize}
                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                    renderDuplicatesCardActions={renderDuplicatesCardActions}
                    ExistingUniqueValueDialogActions={ExistingUniqueValueDialogActions}
                />
            </div>
            <DataEntryWidgetOutput
                dataEntryId={dataEntryId}
                selectedScopeId={newRelationshipProgramId}
                renderCardActions={({ item }) =>
                    <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />
                }
            />
        </div>
    );
};

export const RegisterTeiComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(RegisterTeiPlain);
