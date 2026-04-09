import * as React from 'react';
import { NumericFilter as NumericFilterInput } from './NumericFilter.component';
import type { NumericFilter } from './numeric.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type Props = {
    filter: NumericFilter | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: any, isBlur?: boolean) => void,
    onUpdate: (commitValue?: any) => void,
};

type State = {
    value: {
        min?: string | null,
        max?: string | null,
    } | string | null | undefined;
};

export class NumericFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: NumericFilter | null) {
        if (filter && isEmptyFilterData(filter)) {
            return getEmptyValueFilterValue(filter);
        }
        return {
            min: filter && (filter.ge || filter.ge === 0) ? filter.ge.toString() : undefined,
            max: filter && (filter.le || filter.le === 0) ? filter.le.toString() : undefined,
        };
    }

    constructor(props: Props) {
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
