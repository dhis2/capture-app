import * as React from 'react';
import { NumericFilter } from './NumericFilter.component';
import type { NumericFilterData } from './types';

type Props = {
    filter: NumericFilterData | null,
    filterTypeRef: (instance: any) => void;
    handleCommitValue: (value?: any, isBlur?: boolean) => void,
    onUpdate: (commitValue?: any) => void,
};

type State = {
    value: {
        min?: string | null,
        max?: string | null,
    } | undefined;
};

export class NumericFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: NumericFilterData | null) {
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
            <NumericFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
