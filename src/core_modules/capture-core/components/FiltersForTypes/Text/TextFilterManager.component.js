// @flow
import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';

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
        if (filter?.isEmpty === true) return { value: EMPTY_VALUE_FILTER };
        if (filter?.isEmpty === false) return { value: NOT_EMPTY_VALUE_FILTER };

        return { value: filter?.value || undefined };
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
