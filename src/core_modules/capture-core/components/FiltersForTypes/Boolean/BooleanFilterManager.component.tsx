import * as React from 'react';
import { BooleanFilter as BooleanFilterInput } from './BooleanFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { BooleanFilter, BooleanFilterManagerProps, Value } from './boolean.types';

type State = {
    value: Value | undefined,
};

export class BooleanFilterManager extends React.Component<BooleanFilterManagerProps, State> {
    static calculateDefaultValueState(
        filter: BooleanFilter | null,
        singleSelect: boolean,
    ): Value | undefined {
        if (!filter) return undefined;
        if (isEmptyFilterData(filter)) return getEmptyValueFilterValue(filter);
        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: BooleanFilterManagerProps) {
        super(props);
        this.state = {
            value: BooleanFilterManager.calculateDefaultValueState(this.props.filter, this.props.singleSelect),
        };
    }

    handleCommitValue = (value: Value) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, singleSelect, ...passOnProps } = this.props;

        return (
            <BooleanFilterInput
                value={this.state.value}
                // @ts-expect-error - keeping original functionality as before ts rewrite
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                allowMultiple={!singleSelect}
                {...passOnProps}
            />
        );
    }
}
