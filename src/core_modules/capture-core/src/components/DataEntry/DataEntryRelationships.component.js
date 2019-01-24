// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconButton, withStyles } from '@material-ui/core';
import { ArrowForward as ArrowIcon, MoreHoriz as MoreHorizIcon } from '@material-ui/icons';
import { connect } from 'react-redux';
import LinkButton from '../Buttons/LinkButton.component';
import Button from '../Buttons/Button.component';
import getDataEntryKey from './common/getDataEntryKey';

type Props = {
    classes: {
        container: string,
        relationshipsContainer: string,
        relationship: string,
        relationshipDetails: string,
        relationshipTypeName: string,
        relationshipEntities: string,
        arrowIcon: string,
        relationshipActions: string,
    },
    relationships: Array<Object>,
    onAddRelationship: (itemId: string, id: string) => void,
    itemId: string,
    id: string,
    fromEntity: string,
};


const styles = (theme: Theme) => ({
    relationship: {
        display: 'flex',
        alignItems: 'center',
        padding: 5,
    },
    relationshipDetails: {
        backgroundColor: theme.palette.grey.lighter,
        padding: 7,
        flexGrow: 1,
    },
    relationshipTypeName: {
        fontSize: 14,
        fontWeight: 600,
        color: 'rgba(0,0,0,0.7)',
    },
    relationshipsContainer: {
        marginBottom: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    relationshipEntities: {
        marginTop: 7,
        fontSize: 15,
        display: 'flex',
        alignItems: 'center',
    },
    arrowIcon: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15,
    },
    relationshipActions: {
        padding: 7,
    },
});

const fromDisplayNames = {
    EVENT: i18n.t('This event'),
};

class DataEntryRelationships extends React.Component<Props> {
    handleRemove = () => {

    };

    handleAdd = () => {
        this.props.onAddRelationship(this.props.itemId, this.props.id);
    }

    getRelationships = () => {
        const { classes, fromEntity, relationships } = this.props;
        return relationships.map(r => (
            <div className={classes.relationship} key={r.id}>
                <div className={classes.relationshipDetails}>
                    <div className={classes.relationshipTypeName}>
                        {r.relationshipType.name}
                    </div>
                    <div className={classes.relationshipEntities}>
                        {fromDisplayNames[fromEntity]}
                        <ArrowIcon className={classes.arrowIcon} />
                        {r.entity.displayName}
                    </div>
                </div>
                <div className={classes.relationshipActions}>
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                </div>
            </div>
        ),
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <div className={classes.relationshipsContainer}>
                    {this.getRelationships()}
                </div>
                <div>
                    <Button onClick={this.handleAdd}>
                        {i18n.t('Add relationship')}
                    </Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.id] && state.dataEntries[props.id].itemId;
    const dataEntryKey = getDataEntryKey(props.id, itemId);
    return {
        relationships: state.dataEntriesRelationships[dataEntryKey],
        itemId,
    };
};

export default connect(mapStateToProps, () => ({}), null, { withRef: true })(
    withStyles(styles)(DataEntryRelationships));
