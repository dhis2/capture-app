// @flow
import React, { Component } from 'react';
import Button from '../../Buttons/Button.component';

type Props = {
    selectionsCompleted: boolean,
    programId: ?string,
    orgUnitId: ?string,
    onOpenNewEventPage: (programId: string, orgUnitId: string) => void,
};

class TempSelector extends Component<Props> {
    handleOpenNewEventPage = () => {
        // $FlowSuppress
        this.props.onOpenNewEventPage(this.props.programId, this.props.orgUnitId);
    }

    render() {
        const { selectionsCompleted } = this.props;
        return (
            <Button
                disabled={!selectionsCompleted}
                onClick={this.handleOpenNewEventPage}
            >
                New
            </Button>
        );
    }
}

export default TempSelector;
