import * as React from 'react';
import { NumericFilter as NumericFilterInput } from './NumericFilter.component';
import type { NumericFilter, NumericFilterManagerProps } from './numeric.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type State = {
    value: {
        min?: string | null,
        max?: string | null,
    } | string | null | undefined;
};

export class NumericFilterManager extends React.Component<NumericFilterManagerProps, State> {
    static calculateDefaultState(filter: NumericFilter | null) {
        if (!filter) return undefined;
        if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);

        return {
            min: (filter.ge || filter.ge === 0) ? filter.ge.toString() : undefined,
            max: (filter.le || filter.le === 0) ? filter.le.toString() : undefined,
        };
    }

    constructor(props: NumericFilterManagerProps) {
        super(props);
        this.state = {
            value: NumericFilterManager.calculateDefaultState(this.props.filter),
        };
    }

    handleCommitValue = (value: any, isBlur?: boolean) => {
        this.setState({ value });
        this.props.handleCommitValue?.(value, isBlur);
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <NumericFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
