// @flow
import React, { Component } from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
import { EMPTY_FILTER_VALUE, NOT_EMPTY_FILTER_VALUE } from './constants';
import type { UpdatableFilterContent } from '../types';

type Value = ?string;

type Props = {
    onCommitValue: (value: ?string) => void,
    onUpdate: (updatedValue: ?string) => void,
    value: ?string,
};

// $FlowFixMe[incompatible-variance] automated comment
export class TextFilter extends Component<Props> implements UpdatableFilterContent<Value> {
    onGetUpdateData(updatedValue?: Value) {
        const value = typeof updatedValue !== 'undefined' ? updatedValue : this.props.value;

        return getTextFilterData(value);
    }

    handleEnterKey = (value: ?string) => {
        this.props.onUpdate(value || '');
    };

    handleBlur = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleInputChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleEmptyCheckboxChange = ({ checked }: {| checked: boolean |}) => {
        this.props.onCommitValue(checked ? EMPTY_FILTER_VALUE : '');
    };

    handleNotEmptyCheckboxChange = ({ checked }: {| checked: boolean |}) => {
        this.props.onCommitValue(checked ? NOT_EMPTY_FILTER_VALUE : '');
    };

    render() {
        const { value } = this.props;

        return (
            <>
                <div>
                    <Checkbox
                        label={i18n.t('Is empty')}
                        checked={value === EMPTY_FILTER_VALUE}
                        onChange={this.handleEmptyCheckboxChange}
                    />
                    <Checkbox
                        label={i18n.t('Is not empty')}
                        checked={value === NOT_EMPTY_FILTER_VALUE}
                        onChange={this.handleNotEmptyCheckboxChange}
                    />
                    <MenuDivider />
                </div>

                <Input
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    value={value && value !== NOT_EMPTY_FILTER_VALUE && value !== EMPTY_FILTER_VALUE ? value : ''}
                />
            </>
        );
    }
}
