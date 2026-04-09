import * as React from 'react';
import { OrgUnitFilter } from './OrgUnitFilter.component';
import { getEmptyValueFilterValue } from '../EmptyValue';
import type { OrgUnitFilterData, Value } from './orgUnit.types';

type Props = {
    filter: OrgUnitFilterData | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
    onUpdate: (updatedValue: Value) => void;
};

type State = {
    value: Value;
};

export class OrgUnitFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: OrgUnitFilterData | null | undefined): State {
        if (filter && 'isEmpty' in filter) {
            return { value: getEmptyValueFilterValue(filter) };
        }

        if (!filter?.value) return { value: undefined };

        const id = filter.value;
        const name = filter.name ?? filter.value;
        return { value: { id, name, path: '' } };
    }

    constructor(props: Props) {
        super(props);
        this.state = OrgUnitFilterManager.calculateDefaultState(this.props.filter);
    }

    handleCommitValue = (value: Value) => {
        this.setState({ value });
        this.props.handleCommitValue?.();
    };

    render() {
        const { filter, filterTypeRef, ...passOnProps } = this.props;
        return (
            <OrgUnitFilter
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
