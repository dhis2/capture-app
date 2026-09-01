import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Card } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';

import { NewRelationship } from '../../NewRelationship/NewRelationship.container';
import { DiscardDialog } from '../../../Dialogs/DiscardDialog.component';
import { LinkButton } from '../../../Buttons/LinkButton.component';
import type { PlainProps } from './ViewEventNewRelationshipWrapper.types';
import { getTermLabel } from '../../../../metaData';
import { tCustomTerm } from '../../../../utils/tCustomTerm';

const getStyles = (theme: any) => ({
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
        paddingInlineStart: 8,
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

type Props = PlainProps & WithStyles<typeof getStyles>;

type State = {
    discardDialogOpen?: boolean;
};

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
                {tCustomTerm('New {{eventLabel}} relationship', { eventLabel: getTermLabel(this.props.programId, 'event') })}
            </div>
        </div>
    );

    render() {
        const { classes, onCancel, programId, ...passOnProps } = this.props;
        const eventLabel = getTermLabel(programId, 'event');
        return (
            <div className={classes.container}>
                <div className={classes.backToEventContainer}>
                    <span>{tCustomTerm('Adding relationship to {{eventLabel}}.', { eventLabel })}</span>
                    <LinkButton
                        className={classes.backToEventButton}
                        onClick={this.handleDiscard}
                    >
                        {tCustomTerm('Go back to {{eventLabel}} without saving relationship', { eventLabel })}
                    </LinkButton>
                </div>
                <Card className={classes.newRelationshipPaper}>
                    <NewRelationship
                        header={tCustomTerm('New {{eventLabel}} relationship', { eventLabel })}
                        onCancel={onCancel}
                        {...passOnProps}
                    />
                </Card>
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
