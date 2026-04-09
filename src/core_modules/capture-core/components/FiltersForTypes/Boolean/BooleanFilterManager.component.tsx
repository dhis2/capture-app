import * as React from 'react';
import { BooleanFilter as BooleanFilterInput } from './BooleanFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { BooleanFilter, Value } from './boolean.types';

type Props = {
    filter: BooleanFilter | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void,
    singleSelect: boolean,
};

type State = {
    value: Value | undefined,  // boolean for single-select (e.g. FOLLOW_UP), Array<boolean> for multi-select
};

export class BooleanFilterManager extends React.Component<Props, State> {
    static calculateDefaultValueState(
        filter: BooleanFilter | null,
        singleSelect: boolean,
    ): Value | undefined {
        if (!filter) {
            return undefined;
        }

        if (isEmptyFilterData(filter)) {
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
            <BooleanFilterInput
                value={this.state.value}
                // @ts-expect-error - ref not in ComponentType signature, kept for filter instance access
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                allowMultiple={!singleSelect}
                {...passOnProps}
            />
        );
    }
}

