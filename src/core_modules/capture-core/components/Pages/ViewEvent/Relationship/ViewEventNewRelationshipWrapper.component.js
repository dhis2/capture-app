// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { NewRelationship } from '../../NewRelationship/NewRelationship.container';
import { DiscardDialog } from '../../../Dialogs/DiscardDialog.component';
import { LinkButton } from '../../../Buttons/LinkButton.component';


const getStyles = theme => ({
    container: {
        padding: `${theme.typography.pxToRem(10)} ${theme.typography.pxToRem(24)}`,
    },
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
        container: string,
        headerContainer: string,
        header: string,
        backToEventContainer: string,
        backToEventButton: string,
        newRelationshipPaper: string,
    },
}

type State = {
    discardDialogOpen: ?boolean,
}

class ViewEventNewRelationshipWrapperPlain extends React.Component<Props, State> {
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
            <div className={classes.container}>
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
                    {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                    <NewRelationship
                        header={i18n.t('New event relationship')}
                        onCancel={onCancel}
                        {...passOnProps}
                    />
                </Paper>
                <DiscardDialog
                    header={i18n.t('Discard unsaved changes?')}
                    text={i18n.t('Leaving this page will discard any selections you made for a new relationship')}
                    destructiveText={i18n.t('Yes, discard changes')}
                    cancelText={i18n.t('No, cancel')}
                    onDestroy={onCancel}
                    open={!!this.state.discardDialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>
        );
    }
}

export const ViewEventNewRelationshipWrapperComponent = withStyles(getStyles)(ViewEventNewRelationshipWrapperPlain);
