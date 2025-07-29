import * as React from 'react';
import { AssigneeFilter } from './AssigneeFilter.component';
import type { AssigneeFilterData } from './types';

type Props = {
    filter: AssigneeFilterData | null,
    filterTypeRef: () => void | null,
    handleCommitValue: () => void,
};

type Value = {
    mode: string;
    provided?: any;
} | null;

type State = {
    value: Value;
};

export class AssigneeFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: AssigneeFilterData | null): Value {
        if (!filter) {
            return null;
        }

        return {
            mode: filter.assignedUserMode as string,
            provided: filter.assignedUser,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: AssigneeFilterManager.calculateDefaultValueState(this.props.filter),
        };
    }

    handleCommitValue = (value: any | null) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <AssigneeFilter
                value={this.state.value}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
