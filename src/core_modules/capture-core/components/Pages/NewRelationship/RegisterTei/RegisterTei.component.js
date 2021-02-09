// @flow
import React, { type ComponentType, useContext, useState } from 'react';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
import { RegisterTeiDataEntry } from './DataEntry/RegisterTeiDataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import { DataEntryWidgetOutput } from '../../../DataEntryWidgetOutput/DataEntryWidgetOutput.container';
import { PossibleDuplicatesDialog } from '../../../PossibleDuplicatesDialog';
import { ResultsPageSizeContext } from '../../shared-contexts';
import type { Props } from './RegisterTei.types';
import { withErrorMessageHandler, withLoadingIndicator } from '../../../../HOC';

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

const RegisterTeiPlain = ({
    onLink,
    onSave,
    onReviewDuplicates,
    onGetUnsavedAttributeValues,
    dataEntryId,
    possibleDuplicatesExist,
    trackedEntityName,
    newRelationshipProgramId,
    classes,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const [duplicatesOpen, toggleDuplicatesModal] = useState(false);
    const [savedArguments, setArguments] = useState([]);

    function handleSaveAttempt(...args) {
        if (possibleDuplicatesExist) {
            setArguments(args);
            onReviewDuplicates(resultsPageSize);
            toggleDuplicatesModal(true);
        } else {
            onSave(...args);
        }
    }

    const getActions = () => (
        <React.Fragment>
            <Button
                onClick={handleDialogCancel}
                secondary
            >
                {i18n.t('Cancel')}
            </Button>
            <div style={{ marginLeft: 16 }}>
                <Button
                    dataTest="dhis2-capture-create-as-new-person"
                    onClick={handleSaveFromDialog}
                    primary
                >
                    {i18n.t('Save as new {{trackedEntityName}}', { trackedEntityName })}
                </Button>
            </div>
        </React.Fragment>
    );

    const handleSaveFromDialog = () => {
        onSave(...savedArguments);
    };

    const handleDialogCancel = () => {
        toggleDuplicatesModal(false);
    };

    return (
        <div className={classes.container}>
            <div className={classes.leftContainer}>
                <RegistrationSection />
                <RegisterTeiDataEntry
                    onLink={onLink}
                    onSave={handleSaveAttempt}
                    onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                />
            </div>
            <DataEntryWidgetOutput
                dataEntryId={dataEntryId}
                selectedScopeId={newRelationshipProgramId}
                renderCardActions={({ item }) =>
                    <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />
                }
            />
            <PossibleDuplicatesDialog
                dataEntryId={dataEntryId}
                selectedScopeId={newRelationshipProgramId}
                open={duplicatesOpen}
                onCancel={handleDialogCancel}
                extraActions={getActions()}
                renderCardActions={({ item }) =>
                    <CardListButton teiId={item.id} values={item.values} handleOnClick={onLink} />
                }
            />
        </div>
    );
};

export const RegisterTeiComponent: ComponentType<$Diff<Props, CssClasses>> =
  compose(
      withLoadingIndicator(),
      withErrorMessageHandler(),
      withStyles(getStyles),
  )(RegisterTeiPlain);
