import * as React from 'react';
import { OrgUnitFilter } from './OrgUnitFilter.component';
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

        // From API we get { value: id }. SingleOrgUnitSelectField needs { id, name, path }
        if (filter.id && filter.value !== filter.id) {
            return { value: { id: filter.id, name: filter.value, path: '' } };
        }
        return { value: { id: filter.value, name: filter.value, path: '' } };
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
