// @flow
import React, { useContext, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import GeneralOutput from './GeneralOutput/GeneralOutput.container';
import { ReviewDialog } from './GeneralOutput/WarningsSection/SearchGroupDuplicate/ReviewDialog.component';
import { ResultsPageSizeContext } from '../../shared-contexts';

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

type Props = {
    onLink: (teiId: string) => void,
    onReviewDuplicates: Function,
    onGetUnsavedAttributeValues?: ?Function,
    onSave: Function,
    possibleDuplicates: ?boolean,
    tetName: ?string,
    ...CssClasses
};

const RegisterTei = ({
    onLink,
    onSave,
    onReviewDuplicates,
    onGetUnsavedAttributeValues,
    possibleDuplicates,
    tetName,
    classes,
}: Props) => {
    const { resultsPageSize } = useContext(ResultsPageSizeContext);

    const [duplicatesOpen, toggleDuplicatesModal] = useState(false);
    const [savedArguments, setArguments] = useState([]);

    function handleSaveAttempt(...args) {
        if (possibleDuplicates) {
            setArguments(args);
            onReviewDuplicates(resultsPageSize);
            toggleDuplicatesModal(true);
        } else {
            onSave(...args);
        }
    }

    const handleSaveFromDialog = () => {
        onSave(...savedArguments);
    };

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

export default withStyles(getStyles)(RegisterTei);
