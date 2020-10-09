// @flow
import React, { type ComponentType, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import GeneralOutput from './GeneralOutput/GeneralOutput.container';
import { ReviewDialog } from './GeneralOutput/WarningsSection/SearchGroupDuplicate/ReviewDialog.component';
import type { Props } from './RegisterTei.container';

const getStyles = () => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 10,
        flexBasis: 0,
        marginTop: 10,
    },
});

const RegisterTeiPlain = ({
    onLink,
    onSave,
    onReviewDuplicates,
    onGetUnsavedAttributeValues,
    possibleDuplicates,
    tetName,
    classes,
}: Props) => {
    const [duplicatesOpen, toggleDuplicatesModal] = useState(false);
    const [savedArguments, setArguments] = useState([]);

    function handleSaveAttempt(...args) {
        if (possibleDuplicates) {
            setArguments(args);
            onReviewDuplicates();
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
                    onClick={handleSaveFromDialog}
                    primary
                >
                    {i18n.t('Save as new {{tetName}}', { tetName })}
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
                <DataEntry
                    onLink={onLink}
                    onSave={handleSaveAttempt}
                    onGetUnsavedAttributeValues={onGetUnsavedAttributeValues}
                />
            </div>
            <GeneralOutput
                onLink={onLink}
            />
            <ReviewDialog
                open={duplicatesOpen}
                onLink={onLink}
                onCancel={handleDialogCancel}
                extraActions={getActions()}
            />
        </div>
    );
};

export const RegisterTeiComponent: ComponentType<Props> = withStyles(getStyles)(RegisterTeiPlain);
