// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import withStyles from '@material-ui/core/styles/withStyles';
import type { SelectedRelationshipType } from '../newRelationship.types';
import Button from '../../../Buttons/Button.component';
import TeiSearch from '../../../TeiSearch/TeiSearch.container';
import { makeTrackedEntityTypeSelector } from './teiRelationship.selectors';
import type { TrackedEntityType } from '../../../../metaData';
import { findModes } from '../findModes';
import getTeiDisplayName from '../../../../trackedEntityInstances/getDisplayName';
import { RegisterTei } from '../RegisterTei';
import { ResultsPageSizeContext } from '../../shared-contexts';
import { TeiRelationshipSearchResults } from './SearchResults/TeiRelationshipSearchResults.component';


type Props = {
    findMode?: ?$Values<typeof findModes>,
    onOpenSearch: (trackedEntityTypeId: string, programId: ?string) => void,
    onSelectFindMode: (findMode: $Values<typeof findModes>) => void,
    onAddRelationship: (entity: Object) => void,
    selectedRelationshipType: SelectedRelationshipType,
    classes: {
        container: string,
        button: string,
        buttonIcon: string,
        modeSelectionsContainer: string,
    },
    onGetUnsavedAttributeValues?: ?Function,
}

const getStyles = theme => ({
    modeSelectionsContainer: {
        display: 'flex',
    },
    button: {
        height: theme.typography.pxToRem(150),
        width: theme.typography.pxToRem(250),
        margin: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.grey.lighter,
    },
    buttonIcon: {
        flexGrow: 1,
        fontSize: theme.typography.pxToRem(80),
    },
});

const defaultTrackedEntityTypeName = 'Tracked entity instance';

class TeiRelationship extends React.Component<Props> {
    trackedEntityTypeSelector: (props: Props) => TrackedEntityType;
    constructor(props: Props) {
        super(props);
        this.trackedEntityTypeSelector = makeTrackedEntityTypeSelector();
    }
    getTrackedEntityTypeName = () => {
        const trackedEntityType = this.trackedEntityTypeSelector(this.props);
        if (!trackedEntityType) {
            return defaultTrackedEntityTypeName;
        }
        return trackedEntityType.name;
    }


    handleAddRelationship = (teiId: string, values: Object) => {
        const trackedEntityType = this.trackedEntityTypeSelector(this.props);
        this.props.onAddRelationship({
            id: teiId,
            name: getTeiDisplayName(values, trackedEntityType.attributes, trackedEntityType.name),
        });
    }

    handleAddRelationshipWithNewTei = (itemId: string, dataEntryId: string) => {
        this.props.onAddRelationship({
            itemId,
            dataEntryId,
        });
    }

    renderModeSelections = () => {
        const { classes } = this.props;
        const trackedEntityTypeName = this.getTrackedEntityTypeName();
        return (
            <div
                className={classes.modeSelectionsContainer}
            >
                <div className={classes.button}>
                    <SearchIcon fontSize="large" className={classes.buttonIcon} />
                    <Button
                        dataTest="dhis2-capture-find-relationship-button"
                        color="primary"
                        onClick={() => this.props.onSelectFindMode(findModes.TEI_SEARCH)}
                    >
                        {i18n.t(
                            'Link to an existing {{trackedEntityType}}',
                            { trackedEntityType: trackedEntityTypeName },
                        )}
                    </Button>
                </div>
                <div className={classes.button}>
                    <AddIcon className={classes.buttonIcon} />
                    <Button
                        dataTest="dhis2-capture-create-relationship-button"
                        color="primary"
                        onClick={() => this.props.onSelectFindMode(findModes.TEI_REGISTER)}
                    >
                        {i18n.t('Create new {{trackedEntityType}}', { trackedEntityType: trackedEntityTypeName })}
                    </Button>
                </div>
            </div>

        );
    }

    renderSearch = (props: Object) => {
        const { selectedRelationshipType, onAddRelationship, ...passOnProps } = props;
        const trackedEntityTypeName = this.getTrackedEntityTypeName();
        return (
            <TeiSearch
                resultsPageSize={5}
                id="relationshipTeiSearch"
                getResultsView={viewProps => (
                    <TeiRelationshipSearchResults
                        trackedEntityTypeName={trackedEntityTypeName}
                        onAddRelationship={this.handleAddRelationship}
                        {...viewProps}
                    />
                )}
                {...passOnProps}
            />
        );
    }

    renderRegister = () => (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <RegisterTei
                onLink={this.handleAddRelationship}
                onSave={this.handleAddRelationshipWithNewTei}
                onGetUnsavedAttributeValues={this.props.onGetUnsavedAttributeValues}
            />
        </ResultsPageSizeContext.Provider>
    );

    renderByMode = (findMode, props) => {
        if (findMode === findModes.TEI_SEARCH) {
            return this.renderSearch(props);
        }
        if (findMode === findModes.TEI_REGISTER) {
            return this.renderRegister();
        }
        return null;
    }

    render() {
        const { classes, findMode, onOpenSearch, onSelectFindMode, ...passOnProps } = this.props;

        return (
            <div className={classes.container}>
                {findMode ?
                    this.renderByMode(findMode, passOnProps) :
                    this.renderModeSelections()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(TeiRelationship);

