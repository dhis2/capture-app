import * as React from 'react';
import { TrueOnlyFilter } from './TrueOnlyFilter.component';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';
import type { TrueOnlyFilterData } from './trueOnly.types';

type Props = {
    filter: TrueOnlyFilterData | null,
    filterTypeRef: (instance: any) => void,
    handleCommitValue: () => void,
};

type State = {
    value?: Array<string> | string | null,
};

export class TrueOnlyFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TrueOnlyFilterData | null) {
        if (filter && 'isEmpty' in filter) {
            return { value: filter.isEmpty ? EMPTY_VALUE_FILTER : NOT_EMPTY_VALUE_FILTER };
        }

        return {
            value: filter && filter.value ? ['true'] : undefined,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = TrueOnlyFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Array<string> | null) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <TrueOnlyFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
