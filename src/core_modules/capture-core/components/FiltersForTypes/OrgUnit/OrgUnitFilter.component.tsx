import React, { Component } from 'react';
import { SingleOrgUnitSelectField } from '../../FormFields/New';
import { getOrgUnitFilterData } from './orgUnitFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { OrgUnitFilterProps, Value } from './OrgUnit.types';
import type { OrgUnitValue } from './types';

export class OrgUnitFilter extends Component<OrgUnitFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) { // NOSONAR - imperative API, called externally via ref
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        return getOrgUnitFilterData(value);
    }

    handleOrgUnitChange = (value: OrgUnitValue | null) => {
        this.props.onCommitValue(value);
        if (value) {
            this.props.onUpdate(value);
        }
    };

    render() {
        const { value } = this.props;
        const orgUnitValue =
            value !== undefined &&
            value !== null &&
            typeof value === 'object'
                ? (value as OrgUnitValue)
                : undefined;

        return (
            <SingleOrgUnitSelectField
                value={orgUnitValue}
                onBlur={this.handleOrgUnitChange}
                maxTreeHeight={280}
            />
        );
    }
}
