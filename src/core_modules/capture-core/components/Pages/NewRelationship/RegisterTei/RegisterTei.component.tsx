import React, { useContext, useCallback } from 'react';
import { compose } from 'redux';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '@dhis2/ui';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { ResultsPageSizeContext } from '../../shared-contexts';
import type { PlainProps } from './RegisterTei.types';
import { withErrorMessageHandler } from '../../../../HOC';
import type { EnrollmentPayload } from
    '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance';

const styles: Readonly<any> = {
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

type CardListButtonProps = {
    teiId: string;
    values: any;
    handleOnClick: (teiId: string, values: any) => void;
};

const CardListButton = ({ teiId, values, handleOnClick }: CardListButtonProps) => (
    <Button
        small
        dataTest="view-dashboard-button"
        onClick={() => { handleOnClick(teiId, values); }}
    >
        {i18n.t('Link')}
    </Button>
);

type DialogButtonsProps = {
    onCancel: () => void;
    onSave: () => void;
    trackedEntityName?: string | null;
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

type Props = PlainProps & WithStyles<typeof styles>;

const RegisterTeiPlain = ({
    dataEntryId,
    itemId,
    onLink,
    onSave,
    onCancel,
    onGetUnsavedAttributeValues,
    trackedEntityName,
    trackedEntityTypeId,
    newRelationshipProgramId,
    classes,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext) as any;

    const renderDuplicatesCardActions = useCallback(({ item }: { item: any }) => (
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

    const ExistingUniqueValueDialogActions = useCallback(({
        teiId,
        attributeValues,
    }: {
        teiId: string;
        attributeValues: any
    }) => (
        <Button
            dataTest="existing-unique-value-link-tei-button"
            primary
            onClick={() => { onLink(teiId, attributeValues); }}
        >
            {i18n.t('Link')}
        </Button>
    ), [onLink]);

    const handleSave = useCallback((payload: EnrollmentPayload | TeiPayload) => {
        onSave(itemId, dataEntryId, payload);
    }, [onSave, itemId, dataEntryId]);

    return (
        <div className={classes.container}>
            <div className={classes.leftContainer}>
                <RegistrationSection />
                <RegisterTeiDataEntry
                    {...{
                        onLink,
                        onSave: handleSave,
                        onCancel,
                        onGetUnsavedAttributeValues,
                        duplicatesReviewPageSize: resultsPageSize,
                        renderDuplicatesDialogActions,
                        renderDuplicatesCardActions,
                        ExistingUniqueValueDialogActions,
                        trackedEntityTypeId,
                    } as any}
                />
            </div>
            <DataEntryWidgetOutput
                dataEntryId={dataEntryId}
                selectedScopeId={newRelationshipProgramId}
                renderCardActions={({ item }: { item: any }) =>
                    <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />
                }
            />
        </div>
    );
};

export const RegisterTeiComponent = compose(
    withErrorMessageHandler(),
    withStyles(styles),
)(RegisterTeiPlain) as React.ComponentType<PlainProps>;
