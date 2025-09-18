import * as React from 'react';
import { NumericFilter } from './NumericFilter.component';
import type { NumericFilterData } from './types';

type Props = {
    filter: NumericFilterData | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void,
};

type State = {
    value: {
        min?: string | null,
        max?: string | null,
    },
};

export class NumericFilterManager extends React.Component<Props, State> {
    // eslint-disable-next-line complexity
    static calculateDefaultState(filter: NumericFilterData | null) {
        return {
            min: filter && (filter.ge || filter.ge === 0) ?
                filter.ge.toString() : undefined,
            max: filter && (filter.le || filter.le === 0) ?
                filter.le.toString() : undefined,
        };
    }

    constructor(props: Props) {
        super(props);
        this.state = {
            value: NumericFilterManager.calculateDefaultState(this.props.filter),
        };
    }

    handleCommitValue = (value: any) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <NumericFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
