// @flow
import React, { type ComponentType, useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
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
        dataTest="dhis2-capture-view-dashboard-button"
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
                dataTest="dhis2-capture-create-as-new-person"
                onClick={onSave}
                primary
            >
                {i18n.t('Save as new {{trackedEntityName}}', { trackedEntityName })}
            </Button>
        </div>
    </>
);

const RegisterTeiPlain = ({
    dataEntryId,
    itemId,
    onLink,
    onSave,
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

    const renderDuplicatesDialogActions = useCallback((onCancel, onSaveArgument) => (
        <DialogButtons
            onCancel={onCancel}
            onSave={onSaveArgument}
            trackedEntityName={trackedEntityName}
        />
    ), [trackedEntityName]);

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
                    onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                    duplicatesReviewPageSize={resultsPageSize}
                    renderDuplicatesDialogActions={renderDuplicatesDialogActions}
                    renderDuplicatesCardActions={renderDuplicatesCardActions}
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
