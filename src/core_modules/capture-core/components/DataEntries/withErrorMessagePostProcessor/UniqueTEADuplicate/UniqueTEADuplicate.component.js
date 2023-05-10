// @flow
import * as React from 'react';
import type { ErrorData } from '../../../D2Form/FormBuilder';
import { UniqueTEADuplicateErrorMessageCreator } from './ErrorMessageCreator.component';
import { ExistingTEIDialog } from './ExistingTEIDialog.component';

type Props = {
    ExistingUniqueValueDialogActions: any,
    errorData?: ErrorData,
    trackedEntityTypeName: string,
    attributeName: string,
};

type State = {
    existingTeiDialogOpen: boolean,
};

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
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <UniqueTEADuplicateErrorMessageCreator
                    onShowExisting={this.openDialog}
                    trackedEntityTypeName={trackedEntityTypeName}
                    attributeName={attributeName}
                    {...passOnProps}
                />
                {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
                <ExistingTEIDialog
                    open={existingTeiDialogOpen}
                    onCancel={this.closeDialog}
                    {...passOnProps}
                />
            </React.Fragment>
        );
    }
}
