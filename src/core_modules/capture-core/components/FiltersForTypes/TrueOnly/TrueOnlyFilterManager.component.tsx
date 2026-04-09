import * as React from 'react';
import { TrueOnlyFilter as TrueOnlyFilterInput } from './TrueOnlyFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { TrueOnlyFilter } from './trueOnly.types';

type Props = {
    filter: TrueOnlyFilter | null,
    filterTypeRef: (instance: any) => void,
    handleCommitValue: () => void,
};

type State = {
    value?: Array<string> | string | null,
};

export class TrueOnlyFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TrueOnlyFilter | null) {
        if (!filter) return { value: undefined };
        if (isEmptyFilterData(filter)) return { value: getEmptyValueFilterValue(filter) };
        return { value: filter.value ? ['true'] : undefined };
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
            <TrueOnlyFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
