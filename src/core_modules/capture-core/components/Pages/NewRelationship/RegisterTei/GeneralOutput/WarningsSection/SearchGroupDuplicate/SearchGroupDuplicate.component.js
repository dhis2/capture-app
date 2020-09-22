// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button } from '../../../../../../Buttons';
import WarningMessageCreator from './WarningMessageCreator.container';
import ReviewDialog from './ReviewDialog.component';

type Props = {
    onLink: Function,
};

type State = {
    duplicatesReviewDialogOpen: boolean,
};

class SearchGroupDuplicate extends React.Component<Props, State> {
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
        const { onLink } = this.props;
        const { duplicatesReviewDialogOpen } = this.state;

        return (
            <React.Fragment>
                <WarningMessageCreator
                    onOpenReviewDialog={this.handleOpenReviewDialog}
                />
                <ReviewDialog
                    open={duplicatesReviewDialogOpen}
                    onCancel={this.handleCloseReviewDialog}
                    onLink={onLink}
                    extraActions={this.getHideButton()}
                />
            </React.Fragment>
        );
    }
}

export default SearchGroupDuplicate;
