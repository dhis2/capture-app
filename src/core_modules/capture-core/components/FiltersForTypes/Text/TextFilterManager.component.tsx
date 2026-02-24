import * as React from 'react';
import { TextFilter } from './TextFilter.component';
import type { TextFilterData } from './types';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';

type Props = {
    filter: TextFilterData | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: (value?: string | null, isBlur?: boolean) => void;
    onUpdate: (commitValue?: any) => void;
};

type State = {
    value: string | null | undefined;
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TextFilterData | null | undefined) {
        if (filter?.isEmpty === true) return { value: EMPTY_VALUE_FILTER };
        if (filter?.isEmpty === false) return { value: NOT_EMPTY_VALUE_FILTER };

        return { value: filter?.value || undefined };
    }

    constructor(props: Props) {
        super(props);
        this.state = TextFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: any, isBlur?: boolean) => {
        this.setState({ value });
        this.props.handleCommitValue?.(value, isBlur);
    }

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;

        return (
            <TextFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
