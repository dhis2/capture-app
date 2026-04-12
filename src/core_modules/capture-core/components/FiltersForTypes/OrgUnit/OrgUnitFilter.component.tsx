import React, { Component } from 'react';
import { SingleOrgUnitSelectField } from '../../FormFields/New';
import { getOrgUnitFilterData } from './orgUnitFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { OrgUnitFilterProps, Value } from './orgUnit.types';
import { WithEmptyValueFilter } from '../EmptyValue';

export class OrgUnitFilter extends Component<OrgUnitFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        return getOrgUnitFilterData(value);
    }

    handleOrgUnitChange = (value: Value | null) => {
        this.props.onCommitValue(value);
        if (value === null && this.props.onClearValue) {
            this.props.onClearValue();
        } else {
            this.props.onUpdate(value);
        }
    };

    render() {
        const { value } = this.props;

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={this.props.onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <SingleOrgUnitSelectField
                        value={typeof filteredValue === 'object' ? filteredValue : undefined}
                        onBlur={this.handleOrgUnitChange}
                        maxTreeHeight={280}
                    />
                )}
            </WithEmptyValueFilter>
        );
    }
}
