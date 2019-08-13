// @flow
import * as React from 'react';
import ErrorMessageCreator from './ErrorMessageCreator.container';
import ExistingTEIDialog from './ExistingTEIDialog.component';
import type { ErrorData } from './uniqueTEADuplicate.types';

type Props = {
    id: string,
    errorData: ErrorData,
    onLink: (teiId: string, values: Object) => void,
};

type State = {
    existingTeiDialogOpen: boolean,
};

class UniqueTEADuplicate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            existingTeiDialogOpen: false,
        };
    }

    handleShowExisting = () => {
        this.setState({
            existingTeiDialogOpen: true,
        });
    }

    handleCancelLink = () => {
        this.setState({
            existingTeiDialogOpen: false,
        });
    }

    handleLink = (values: Object) => {
        this.setState({
            existingTeiDialogOpen: false,
        });
        const teiId = this.props.errorData.id;
        this.props.onLink(teiId, values);
    }

    render() {
        const { id, onLink, ...passOnProps } = this.props;
        const { existingTeiDialogOpen } = this.state;

        return (
            <React.Fragment>
                <ErrorMessageCreator
                    onShowExisting={this.handleShowExisting}
                    id={id}
                    {...passOnProps}
                />
                <ExistingTEIDialog
                    open={existingTeiDialogOpen}
                    onCancel={this.handleCancelLink}
                    onLink={this.handleLink}
                    {...passOnProps}
                />
            </React.Fragment>
        );
    }
}

export default UniqueTEADuplicate;
