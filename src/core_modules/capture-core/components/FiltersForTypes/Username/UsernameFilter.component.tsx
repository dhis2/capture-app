import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { UserField } from '../../FormFields/UserField';
import { getUsernameFilterData } from './usernameFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { UsernameFilterProps, Value } from './Username.types';

export class UsernameFilter extends Component<UsernameFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) { // NOSONAR - imperative API, called externally via ref
        const value = updatedValue === undefined ? this.props.value : updatedValue;
        return getUsernameFilterData(value);
    }

    handleUserSet = (username: Value) => {
        this.props.onCommitValue(username ?? null);
        if (username) {
            this.props.onUpdate(username);
        }
    };

    render() {
        const { value } = this.props;
        const usernameValue = value !== undefined && value !== null && typeof value === 'string' ? value : null;

        return (
            <UserField
                value={usernameValue}
                onSet={this.handleUserSet}
                inputPlaceholderText={i18n.t('Search for user')}
                focusOnMount
                usernameOnlyMode
            />
        );
    }
}
