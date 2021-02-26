// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../Buttons';
import { WarningMessageCreator } from './WarningMessageCreator.component';
import { PossibleDuplicatesDialog } from '../../../PossibleDuplicatesDialog';
import type { RenderCustomCardActions } from '../../../CardList/CardList.types';

type Props = {|
    renderCardActions: RenderCustomCardActions,
    selectedScopeId: string,
    dataEntryId: string
|};

type State = {
    duplicatesReviewDialogOpen: boolean,
};

export class SearchGroupDuplicate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            duplicatesReviewDialogOpen: false,
        };
    }

    handleOpenReviewDialog = () => {
        this.setState({
            duplicatesReviewDialogOpen: true,
        });
    }

    handleCloseReviewDialog = () => {
        this.setState({
            duplicatesReviewDialogOpen: false,
        });
    }

    getHideButton() {
        return (
            <Button onClick={this.handleCloseReviewDialog}>
                {i18n.t('Hide')}
            </Button>
        );
    }

    render() {
        const { selectedScopeId, dataEntryId, renderCardActions } = this.props;
        const { duplicatesReviewDialogOpen } = this.state;

        return (
            <React.Fragment>
                <WarningMessageCreator
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    onOpenReviewDialog={this.handleOpenReviewDialog}
                />
                <PossibleDuplicatesDialog
                    dataEntryId={dataEntryId}
                    selectedScopeId={selectedScopeId}
                    open={duplicatesReviewDialogOpen}
                    onCancel={this.handleCloseReviewDialog}
                    extraActions={this.getHideButton()}
                    renderCardActions={renderCardActions}
                />
            </React.Fragment>
        );
    }
}
