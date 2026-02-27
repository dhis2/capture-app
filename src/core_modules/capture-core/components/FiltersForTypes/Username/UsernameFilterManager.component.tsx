import * as React from 'react';
import { UsernameFilter } from './UsernameFilter.component';
import type { UsernameFilterData } from './types';
import type { Value } from './Username.types';

type Props = {
    filter: UsernameFilterData | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: Value) => void;
    onUpdate: (updatedValue: Value) => void;
};

type State = {
    value: Value;
};

export class UsernameFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: UsernameFilterData | null | undefined): State {
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
            <UsernameFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
