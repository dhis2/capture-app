import * as React from 'react';
import { TextFilter as TextFilterInput } from './TextFilter.component';
import type { TextFilter } from './text.types';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';

type Props = {
    filter: TextFilter | null | undefined;
    filterTypeRef: (instance: unknown) => void;
    handleCommitValue: (value?: string | null, isBlur?: boolean) => void;
    onUpdate: (commitValue?: any) => void;
};

type State = {
    value: string | null | undefined;
};

export class TextFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: TextFilter | null | undefined) {
        if (filter && isEmptyFilterData(filter)) {
            return { value: getEmptyValueFilterValue(filter) };
        }

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
            <TextFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
