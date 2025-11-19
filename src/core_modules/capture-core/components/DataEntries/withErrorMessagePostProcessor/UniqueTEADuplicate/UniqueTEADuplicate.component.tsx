import * as React from 'react';
import { UniqueTEADuplicateErrorMessageCreator } from './ErrorMessageCreator.component';
import { ExistingTEIDialog } from './ExistingTEIDialog.component';
import type { Props, State } from './uniqueTEADuplicate.types';

export class UniqueTEADuplicate extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            existingTeiDialogOpen: false,
        };
    }

    openDialog = () => {
        this.setState({
            existingTeiDialogOpen: true,
        });
    }

    closeDialog = () => {
        this.setState({
            existingTeiDialogOpen: false,
        });
    }

    render() {
        const { attributeName, trackedEntityTypeName, ...passOnProps } = this.props;
        const { existingTeiDialogOpen } = this.state;

        return (
            <React.Fragment>
                <UniqueTEADuplicateErrorMessageCreator
                    onShowExisting={this.openDialog}
                    trackedEntityTypeName={trackedEntityTypeName}
                    attributeName={attributeName}
                    {...passOnProps}
                />
                <ExistingTEIDialog
                    open={existingTeiDialogOpen}
                    onCancel={this.closeDialog}
                    {...passOnProps}
                />
            </React.Fragment>
        );
    }
}
