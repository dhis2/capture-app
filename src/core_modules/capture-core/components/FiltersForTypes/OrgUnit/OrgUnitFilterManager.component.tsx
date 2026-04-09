import * as React from 'react';
import { OrgUnitFilter as OrgUnitFilterInput } from './OrgUnitFilter.component';
import { getEmptyValueFilterValue, isEmptyFilterData } from '../EmptyValue';
import type { OrgUnitFilter, Value } from './orgUnit.types';

type Props = {
    filter: OrgUnitFilter | null | undefined;
    filterTypeRef: (instance: any) => void;
    handleCommitValue: () => void;
    onUpdate: (updatedValue: Value) => void;
};

type State = {
    value: Value;
};

export class OrgUnitFilterManager extends React.Component<Props, State> {
    static calculateDefaultState(filter: OrgUnitFilter | null | undefined): State {
        if (!filter) return { value: undefined };
        if (isEmptyFilterData(filter)) return { value: getEmptyValueFilterValue(filter) };

        const { value, name } = filter;
        if (!value) return { value: undefined };
        return { value: { id: value, name: name ?? value, path: '' } };
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
            <OrgUnitFilterInput
                value={this.state.value}
                ref={filterTypeRef}
                onCommitValue={this.handleCommitValue}
                {...passOnProps}
            />
        );
    }
}
