import React, { Component } from 'react';
import i18n from '@dhis2/d2-i18n';
import { UserField } from '../../FormFields/UserField';
import { getUsernameFilterData } from './usernameFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import type { UsernameFilterProps, Value } from './username.types';
import { WithEmptyValueFilter } from '../EmptyValue';

export class UsernameFilter extends Component<UsernameFilterProps> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
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

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={this.props.onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <UserField
                        value={typeof filteredValue === 'string' ? filteredValue : null}
                        onSet={this.handleUserSet}
                        inputPlaceholderText={i18n.t('Search for user')}
                        focusOnMount
                        usernameOnlyMode
                    />
                )}
            </WithEmptyValueFilter>
        );
    }
}
