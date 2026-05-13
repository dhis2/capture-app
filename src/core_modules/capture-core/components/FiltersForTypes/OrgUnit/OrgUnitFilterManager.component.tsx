import * as React from 'react';
import { OrgUnitFilter as OrgUnitFilterInput } from './OrgUnitFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { OrgUnitFilter, OrgUnitFilterManagerProps, Value } from './orgUnit.types';

type State = {
    value: Value;
};

export class OrgUnitFilterManager extends React.Component<OrgUnitFilterManagerProps, State> {
    static calculateDefaultState(filter: OrgUnitFilter | null | undefined): State {
        if (!filter) return { value: undefined };
        if (isEmptyFilterData(filter)) return { value: getEmptyValueFilterValue(filter) };

        const { value, name } = filter;
        return { value: { id: value, name: name ?? value, path: '' } };
    }

    constructor(props: OrgUnitFilterManagerProps) {
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
            <OrgUnitFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
