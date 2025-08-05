// @flow
import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from '../../common/filters';
import type { TextFilterData } from './types';

type Props = {
    filter: ?TextFilterData,
    filterTypeRef: Function,
    handleCommitValue: () => void,
};

type State = {
    value: ?string,
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: ?TextFilterData) {
        if (!filter) {
            return { value: undefined };
        }

        if (filter.isEmpty) {
            return { value: EMPTY_FILTER_VALUE };
        }

        if (filter.isNotEmpty) {
            return { value: NOT_EMPTY_FILTER_VALUE };
        }

        return { value: filter.value || undefined };
    }

    constructor(props: Props) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: ?string) => {
        this.setState({
            value,
        });
        this.props.handleCommitValue && this.props.handleCommitValue();
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <TextFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
