// @flow
import * as React from 'react';
import AssigneeFilter from './AssigneeFilter.component';
import type { AssigneeFilterData } from './types';

type Props = {
    filter: ?AssigneeFilterData,
    filterTypeRef: ?Function,
};

type State = {
    value?: ?{
        mode?: ?string,
        provided?: ?Object,
    },
};

class AssigneeFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: ?AssigneeFilterData) {
        if (!filter) {
            return undefined;
        }

        return {
            mode: filter.assignedUserMode,
            provided: filter.assignedUser,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: AssigneeFilterManager.calculateDefaultValueState(this.props.filter),
        };
    }

    handleCommitValue = (value: ?Object) => {
        this.setState({
            value,
        });
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <AssigneeFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}

export default AssigneeFilterManager;
