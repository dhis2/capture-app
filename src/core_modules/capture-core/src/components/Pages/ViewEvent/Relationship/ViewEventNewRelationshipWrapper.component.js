// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '../../../Buttons/Button.component';
import NewRelatonship from '../../NewRelationship/NewRelationship.container';
import ConfirmDialog from '../../../Dialogs/ConfirmDialog.component';


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
    backToEventButton: {
        paddingLeft: 8,
        marginBottom: 10,
        textTransform: 'none',
        backgroundColor: '#E9EEF4',
        boxShadow: 'none',
        color: '#494949',
        fontSize: 14,
        fontWeight: 'normal',
    },
});

type Props = {
    onCancel: () => void,
    classes: {
        headerContainer: string,
        header: string,
        backToEventButton: string,
        newRelationshipPaper: string,
    },
}

type State = {
    discardDialogOpen: ?boolean,
}

class ViewEventNewRelationshipWrapper extends React.Component<Props, State> {
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

    render() {
        const { classes, onCancel, ...passOnProps } = this.props;
        return (
            <div>
                <Button className={classes.backToEventButton} variant="raised" onClick={this.handleDiscard}>
                    <ChevronLeft />
                    {i18n.t('Back to event')}
                </Button>
                <Paper className={classes.newRelationshipPaper}>
                    <NewRelatonship
                        header={i18n.t('New event relationship')}
                        {...passOnProps}
                    />
                </Paper>
                <ConfirmDialog
                    header={i18n.t('Discard relationship?')}
                    text={i18n.t('Leaving this page will discard any selections you made for a new relationship')}
                    confirmText={i18n.t('Discard')}
                    cancelText={i18n.t('Back to relationship')}
                    onConfirm={this.props.onCancel}
                    open={!!this.state.discardDialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(ViewEventNewRelationshipWrapper);
