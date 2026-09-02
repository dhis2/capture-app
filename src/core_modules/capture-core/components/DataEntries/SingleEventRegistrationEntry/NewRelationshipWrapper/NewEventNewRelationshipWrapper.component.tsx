import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Card } from '@dhis2/ui';
import { withStyles, WithStyles } from 'capture-core-utils/styles';
import { NewRelationship } from '../../../Pages/NewRelationship/NewRelationship.container';
import { DiscardDialog } from '../../../Dialogs/DiscardDialog.component';
import { LinkButton } from '../../../Buttons/LinkButton.component';
import { getTermLabel } from '../../../../metaData';
import { customTerms } from '../../../../utils/customTerms';

const getStyles = (theme: any) => ({
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

type Props = {
    onCancel: (dataEntryid: string) => void;
    dataEntryKey: string;
    unsavedRelationships: any;
    programId: string;
};

type State = {
    discardDialogOpen?: boolean | null;
};

class NewEventNewRelationshipWrapper extends React.Component<Props & WithStyles<typeof getStyles>, State> {
    constructor(props: Props & WithStyles<typeof getStyles>) {
        super(props);
        this.state = {
            discardDialogOpen: false,
        };
    }

    onGetUnsavedAttributeValues = (id: string) => {
        const { unsavedRelationships } = this.props;
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

    handleDiscard = () => {
        this.setState({ discardDialogOpen: true });
    }

    handleCancelDiscard = () => {
        this.setState({ discardDialogOpen: false });
    }

    render() {
        const { classes, onCancel, programId, ...passOnProps } = this.props;
        const eventLabel = getTermLabel('event', { programId });
        const relationshipLabel = getTermLabel('relationship', { programId });
        return (
            <div>
                <div className={classes.backToEventContainer}>
                    <span>
                        {customTerms.i18n.t(
                            'Adding {{relationshipLabel}} to {{eventLabel}}.',
                            { eventLabel, relationshipLabel },
                        )}
                    </span>
                    <LinkButton
                        className={classes.backToEventButton}
                        onClick={this.handleDiscard}
                    >
                        {customTerms.i18n.t(
                            'Go back to {{eventLabel}} without saving {{relationshipLabel}}',
                            { eventLabel, relationshipLabel },
                        )}
                    </LinkButton>
                </div>
                <Card className={classes.newRelationshipPaper}>
                    <NewRelationship
                        header={customTerms.i18n.t(
                            'New {{eventLabel}} {{relationshipLabel}}',
                            { eventLabel, relationshipLabel },
                        )}
                        onGetUnsavedAttributeValues={this.onGetUnsavedAttributeValues}
                        onCancel={onCancel}
                        {...passOnProps}
                    />
                </Card>
                <DiscardDialog
                    header={i18n.t('Discard unsaved changes?')}
                    text={customTerms.i18n.t(
                        'Leaving this page will discard the selections you made for a new {{relationshipLabel}}',
                        { relationshipLabel },
                    )}
                    destructiveText={i18n.t('Yes, discard changes')}
                    cancelText={i18n.t('No, cancel')}
                    onDestroy={() => this.props.onCancel('relationship')}
                    open={!!this.state.discardDialogOpen}
                    onCancel={this.handleCancelDiscard}
                />
            </div>
        );
    }
}

export const NewRelationshipWrapperComponent = withStyles(getStyles)(NewEventNewRelationshipWrapper);
