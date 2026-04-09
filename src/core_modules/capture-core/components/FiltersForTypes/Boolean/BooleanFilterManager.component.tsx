import * as React from 'react';
import { BooleanFilter } from './BooleanFilter.component';
import { getEmptyValueFilterValue } from '../EmptyValue';
import type { BooleanFilterData, Value } from './boolean.types';

type Props = {
    filter: BooleanFilterData | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void,
    singleSelect: boolean,
};

type State = {
    value: Value | undefined,  // boolean for single-select (e.g. FOLLOW_UP), Array<boolean> for multi-select
};

export class BooleanFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(
        filter: BooleanFilterData | null,
        singleSelect: boolean,
    ): Value | undefined {
        if (!filter) {
            return undefined;
        }

        if ('isEmpty' in filter) {
            return getEmptyValueFilterValue(filter);
        }

        return singleSelect ? filter.values[0] : filter.values;
    }

    constructor(props: Props) {
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
            <BooleanFilter
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
