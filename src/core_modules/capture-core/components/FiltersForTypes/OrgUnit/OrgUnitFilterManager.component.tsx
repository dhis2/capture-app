import * as React from 'react';
import { OrgUnitFilter } from './OrgUnitFilter.component';
import { EMPTY_VALUE_FILTER, NOT_EMPTY_VALUE_FILTER } from '../EmptyValue';
import type { OrgUnitFilterData } from './types';
import type { Value } from './OrgUnit.types';

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
        if (!filter?.value) return { value: undefined };

        if (filter.isEmpty === true) {
            return { value: EMPTY_VALUE_FILTER };
        }
        if (filter.isEmpty === false) {
            return { value: NOT_EMPTY_VALUE_FILTER };
        }

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
