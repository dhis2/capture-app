import * as React from 'react';
import { UsernameFilter as UsernameFilterInput } from './UsernameFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { UsernameFilter, Value } from './username.types';

type Props = {
    filter: UsernameFilter | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: Value) => void;
    onUpdate: (updatedValue: Value) => void;
};

type State = {
    value: Value;
};

export class UsernameFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: UsernameFilter | null | undefined): State {
        if (filter && isEmptyFilterData(filter)) {
            return { value: getEmptyValueFilterValue(filter) };
        }

        if (!filter?.value) return { value: undefined };

        return { value: filter.value };
    }

    constructor(props: Props) {
        super(props);
        this.state = UsernameFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Value) => {
        this.setState({ value });
        this.props.handleCommitValue?.(value);
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;
        return (
            <UsernameFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
