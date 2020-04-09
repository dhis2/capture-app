// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core';
import NewRelatonship from '../../NewRelationship/NewRelationship.container';
import ConfirmDialog from '../../../Dialogs/ConfirmDialog.component';
import LinkButton from '../../../Buttons/LinkButton.component';


const getStyles = theme => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 18,
        fontWeight: 500,
        paddingLeft: 8,
    },
    newRelationshipPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    backToEventContainer: {
        padding: 8,
        borderRadius: 4,
        display: 'inline-block',
        marginBottom: 10,
        backgroundColor: '#E9EEF4',
        color: '#494949',
        fontSize: 14,
    },
    backToEventButton: {
        backgroundColor: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
    },
});

type Props = {
    onCancel: () => void,
    classes: {
        headerContainer: string,
        header: string,
        backToEventContainer: string,
        backToEventButton: string,
        newRelationshipPaper: string,
    },
    unsavedRelationships: Object,
}

type State = {
    discardDialogOpen: ?boolean,
}

class NewEventNewRelationshipWrapper extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            discardDialogOpen: false,
        };
    }
    handleDiscard = () => {
        this.setState({ discardDialogOpen: true });
    }

    handleCancelDiscard = () => {
        this.setState({ discardDialogOpen: false });
    }

    renderHeader = () => (
        <div
            className={this.props.classes.headerContainer}
        >
            <div className={this.props.classes.header} >
                {i18n.t('New event relationship')}
            </div>
        </div>
    );

    onGetUnsavedAttributeValues = (id: string) => {
        const { unsavedRelationships } = this.props;
        return unsavedRelationships
            .map((r) => {
                if (!r.to.data || !r.to.data.attributes) {
                    return null;
                }

                const attributeItem = r.to.data.attributes.find(a => a.attribute === id);
                return attributeItem && attributeItem.value;
            })
            .filter(v => v);
    }

    render() {
        const { classes, onCancel, ...passOnProps } = this.props;
        return (
            <div>
                <div className={classes.backToEventContainer}>
                    <span>{i18n.t('Adding relationship to event.')}</span>
                    <LinkButton
                        className={classes.backToEventButton}
                        onClick={this.handleDiscard}
                    >
                        {i18n.t('Go back to event without saving relationship')}
                    </LinkButton>
                </div>
                <Paper className={classes.newRelationshipPaper}>
                    <NewRelatonship
                        header={i18n.t('New event relationship')}
                        onGetUnsavedAttributeValues={this.onGetUnsavedAttributeValues}
                        {...passOnProps}
                    />
                </Paper>
                <ConfirmDialog
                    header={i18n.t('Unsaved changes')}
                    text={i18n.t('Leaving this page will discard the selections you made for a new relationship')}
                    confirmText={i18n.t('Yes, discard')}
                    cancelText={i18n.t('No, stay here')}
                    onConfirm={this.props.onCancel}
                    open={!!this.state.discardDialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(NewEventNewRelationshipWrapper);
