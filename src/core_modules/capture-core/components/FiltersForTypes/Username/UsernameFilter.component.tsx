import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { UserField } from '../../FormFields/UserField';
import { getUsernameFilterData } from './usernameFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { UsernameFilterProps, Value } from './Username.types';
import {
    makeCheckboxHandler,
    isEmptyValueFilter,
    EMPTY_VALUE_FILTER,
    NOT_EMPTY_VALUE_FILTER,
    EmptyValueFilterCheckboxes,
} from '../EmptyValue';

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

    handleEmptyValueCheckboxChange = makeCheckboxHandler(EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    handleNotEmptyValueCheckboxChange = makeCheckboxHandler(NOT_EMPTY_VALUE_FILTER)((value) => {
        this.props.onCommitValue(value ?? null);
    });

    render() {
        const { value } = this.props;
        const isEmptyFilter = typeof value === 'string' && isEmptyValueFilter(value);
        const usernameValue = !isEmptyFilter && value !== undefined
            && value !== null && typeof value === 'string' ? value : null;

        return (
            <div>
                <EmptyValueFilterCheckboxes
                    value={isEmptyFilter ? value : undefined}
                    onEmptyChange={this.handleEmptyValueCheckboxChange}
                    onNotEmptyChange={this.handleNotEmptyValueCheckboxChange}
                />

                <UserField
                    value={usernameValue}
                    onSet={this.handleUserSet}
                    inputPlaceholderText={i18n.t('Search for user')}
                    focusOnMount
                    usernameOnlyMode
                />
            </div>
        );
    }
}
