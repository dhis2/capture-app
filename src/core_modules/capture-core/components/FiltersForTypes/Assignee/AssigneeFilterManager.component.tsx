import * as React from 'react';
import { AssigneeFilter as AssigneeFilterComponent } from './AssigneeFilter.component';
import type { AssigneeFilter, AssigneeFilterManagerProps, Value } from './assignee.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type State = {
    value?: Value | null;
};

export class AssigneeFilterManager extends React.Component<AssigneeFilterManagerProps, State> {
    static calculateDefaultValueState(filter: AssigneeFilter | null): Value | undefined {
        if (!filter) {
            return undefined;
        }
        if (isEmptyFilterData(filter)) {
            return getEmptyValueFilterValue(filter);
        }

        return {
            mode: filter.assignedUserMode,
            provided: filter.assignedUser,
        };
    }

    constructor(props: AssigneeFilterManagerProps) {
        super(props);
        this.state = {
            value: AssigneeFilterManager.calculateDefaultValueState(this.props.filter),
        };
    }

    handleCommitValue = (value: Value) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <AssigneeFilterComponent
                value={this.state.value}
                // @ts-expect-error - keeping original functionality as before ts rewrite
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
