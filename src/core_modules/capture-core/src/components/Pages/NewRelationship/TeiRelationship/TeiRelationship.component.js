// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import withStyles from '@material-ui/core/styles/withStyles';
import ProgramCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import RelationshipType from '../../../../metaData/RelationshipType/RelationshipType';
import Button from '../../../Buttons/Button.component';
import TeiSearch from '../../../TeiSearch/TeiSearch.container';
import TeiRelationshipSearchResults from './TeiRelationshipSearchResults.component';

type Props = {
    findMode: string,
    onOpenSearch: (trackedEntityTypeId: string, programId: ?string) => void,
    onSelectFindMode: (findMode: string) => void,
    selectedRelationshipType: RelationshipType,
    classes: {
        container: string,
        button: string,
        buttonIcon: string,
        modeSelectionsContainer: string,
    }
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

const findModes = {
    TEI_SEARCH: 'TEI_SEARCH',
    TEI_REGISTER: 'TEI_REGISTER',
};

const defaultTrackedEntityTypeName = 'Tracked entity instance';

class TeiRelationship extends React.Component<Props> {
    getTrackedEntityTypeName = () => {
        const to = this.props.selectedRelationshipType.to;
        if (to.programId) {
            // $FlowFixMe
            return ProgramCollection.get(to.programId).trackedEntityType.displayName;
        }
        return defaultTrackedEntityTypeName;
    }

    renderModeSelections = () => {
        const { classes, selectedRelationshipType } = this.props;
        const to = selectedRelationshipType.to;
        const trackedEntityTypeName = this.getTrackedEntityTypeName();
        return (
            <div
                className={classes.modeSelectionsContainer}
            >
                <div className={classes.button}>
                    <SearchIcon fontSize="large" className={classes.buttonIcon} />
                    <Button
                        color="primary"
                        onClick={() => this.props.onOpenSearch(to.trackedEntityTypeId, to.programId)}
                    >
                        {i18n.t('Link to an existing {{trackedEntityType}}', { trackedEntityType: trackedEntityTypeName })}
                    </Button>
                </div>
                <div className={classes.button}>
                    <AddIcon className={classes.buttonIcon} />
                    <Button
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
        return (
            <TeiSearch
                id="relationshipTeiSearch"
                programId={selectedRelationshipType.to.programId}
                trackedEntityTypeId={selectedRelationshipType.to.trackedEntityTypeId}
                getResultsView={viewProps => (
                    <TeiRelationshipSearchResults
                        onAddRelationship={onAddRelationship}
                        {...viewProps}
                    />
                )}
                {...passOnProps}
            />
        );
    }

    renderRegister = (props: Object) => (<div />);

    renderByMode = (findMode, props) => {
        if (findMode === findModes.TEI_SEARCH) {
            return this.renderSearch(props);
        }
        if (findMode === findModes.TEI_REGISTER) {
            return this.renderRegister(props);
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

