// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import withStyles from '@material-ui/core/styles/withStyles';
import ProgramCollection from '../../../../metaDataMemoryStores/programCollection/programCollection';
import RelationshipType from '../../../../metaData/RelationshipType/RelationshipType';
import Button from '../../../Buttons/Button.component';
import Search from '../../../Search/Search.component';

type Props = {
    selectedRelationshipType: RelationshipType,
    classes: {
        container: string,
        button: string,
        buttonIcon: string,
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

type TeiRelationshipOptions = {
    trackedEntityType: {
        id: string,
        displayName: string,
    },
    searchGroups: any,
    program: ?{
        displayName: string,
        id: string,
    },
}

class TeiRelationship extends React.Component<Props> {
    static getByProgram = (programId: string) => {
        const program = ProgramCollection.get(programId);
        return {
            // $FlowFixMe
            trackedEntityType: program.trackedEntityType,
            // $FlowFixMe
            program: { id: program.id, displayName: program.displayName },
            // $FlowFixMe
            searchGroups: program.searchGroups,
        };
    }

    static getByTrackedEntityType = (trackedEntityTypeId: string) => {
        return {};
    }

    relationshipOptions: TeiRelationshipOptions;
    constructor(props: Props) {
        super(props);
        const to = props.selectedRelationshipType.to;
        this.relationshipOptions = to.programId ?
            TeiRelationship.getByProgram(to.programId) : {};
    }

    renderModeSelections = () => {
        const { classes } = this.props;
        const trackedEntityTypeName = this.relationshipOptions.trackedEntityType.displayName.toLowerCase();
        return (
            <div className={classes.modeSelectionsContainer}>
                <div className={classes.button}>
                    <SearchIcon fontSize="large" className={classes.buttonIcon} />
                    <Button color="primary">{i18n.t('Link to an existing {{trackedEntityType}}', { trackedEntityType: trackedEntityTypeName })}</Button>
                </div>
                <div className={classes.button}>
                    <AddIcon className={classes.buttonIcon} />
                    <Button color="primary">{i18n.t('Create new {{trackedEntityType}}', { trackedEntityType: trackedEntityTypeName })}</Button>
                </div>
            </div>

        );
    }

    renderByMode = (mode: any) => {
        return mode === 'search' ?
            this.relationshipOptions.searchGroups.map(s => (
                <Search
                    searchForm={s.searchForm}
                />
            )) : null;
    }

    render() {
        const { classes } = this.props;
        const mode = null;
        return (
            <div className={classes.container}>
                { mode ? this.renderByMode(mode) : this.renderModeSelections() }
            </div>
        );
    }
}

export default withStyles(getStyles)(TeiRelationship);

