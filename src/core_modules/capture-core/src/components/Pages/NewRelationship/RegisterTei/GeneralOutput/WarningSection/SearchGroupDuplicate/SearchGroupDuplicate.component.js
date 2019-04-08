// @flow
import React from 'react';
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
                />
            </React.Fragment>
        );
    }
}

export default SearchGroupDuplicate;
