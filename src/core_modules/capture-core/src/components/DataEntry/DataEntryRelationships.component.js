// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import LinkIcon from '@material-ui/icons/Link';
import { connect } from 'react-redux';
import LinkButton from '../Buttons/LinkButton.component';
import Button from '../Buttons/Button.component';

type Props = {
    classes: {
        relationship: string,
        relationshipText: string,
    },
    onAddRelationship: (itemId: string, id: string) => void,
    itemId: string,
    id: string,
};


const styles = theme => ({
    relationship: {
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        borderBottom: '2px solid #ECEFF1',
    },
    relationshipText: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
    },
    relationshipsContainer: {
        marginBottom: 10,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
});

class DataEntryRelationships extends React.Component<Props> {
    relationships: any;

    constructor(props: Props) {
        super(props);
        this.relationships = [
            {
                id: '1',
                displayName: 'Sabla Osman',
            },
        ];
    }

    handleRemove = () => {

    };

    handleAdd = () => {
        this.props.onAddRelationship(this.props.itemId, this.props.id);
    }

    getRelationships = () => {
        const classes = this.props.classes;
        return this.relationships.map(r => (
            <div className={classes.relationship} key={r.id}>
                <div className={classes.relationshipText}>
                    <LinkIcon />
                    {i18n.t('Linked to ')}
                    {r.displayName}
                </div>
                <LinkButton onClick={this.handleRemove}>
                    {i18n.t('Remove')}
                </LinkButton>

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
                        {i18n.t('Add link')}
                    </Button>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state: ReduxState, props: { id: string }) => {
    const itemId = state.dataEntries && state.dataEntries[props.dataEntryId] && state.dataEntries[props.dataEntryId].itemId;
    return {
        itemId,
    };
};

export default connect(mapStateToProps, () => ({}), null, { withRef: true })(
    withStyles(styles)(DataEntryRelationships));
