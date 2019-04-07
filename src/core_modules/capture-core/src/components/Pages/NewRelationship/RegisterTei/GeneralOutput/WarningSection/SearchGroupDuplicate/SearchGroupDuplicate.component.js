// @flow
import React from 'react';
import WarningMessageCreator from './WarningMessageCreator.container';
import ReviewDialog from './ReviewDialog.component';

type Props = {

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
        const { ...passOnProps } = this.props;
        const { duplicatesReviewDialogOpen } = this.state;

        return (
            <React.Fragment>
                <WarningMessageCreator
                    onOpenReviewDialog={this.handleOpenReviewDialog}
                />
                <ReviewDialog
                    open={duplicatesReviewDialogOpen}
                    onCancel={this.handleCloseReviewDialog}
                />
            </React.Fragment>
        );
    }
}

export default SearchGroupDuplicate;
