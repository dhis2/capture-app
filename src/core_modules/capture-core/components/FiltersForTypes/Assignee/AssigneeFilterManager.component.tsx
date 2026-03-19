import * as React from 'react';
import { AssigneeFilter } from './AssigneeFilter.component';
import type { AssigneeFilterData } from './types';

type Props = {
    filter: AssigneeFilterData | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void,
};

type Value = {
    mode: string;
    provided?: any;
} | null;

type State = {
    value?: Value | null;
};

export class AssigneeFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(filter: AssigneeFilterData | null): Value | undefined {
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
                // @ts-expect-error - keeping original functionality as before ts rewrite
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
