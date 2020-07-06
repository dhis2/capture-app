// @flow
import * as React from 'react';
import NumericFilter from './NumericFilter.component';
import type { NumericFilterData } from '../filters.types';

type Props = {
    filter: ?NumericFilterData,
    filterTypeRef: ?Function,
};

type State = {
    value: {
        min: ?string,
        max: ?string,
    },
};

class NumericFilterManager extends React.Component<Props, State> {
    // eslint-disable-next-line complexity
    static calculateDefaultState(filter: ?NumericFilterData) {
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

    handleCommitValue = (value: Object) => {
        this.setState({
            value,
        });
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <NumericFilter
                value={this.state.value}
                innerRef={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}

export default NumericFilterManager;
