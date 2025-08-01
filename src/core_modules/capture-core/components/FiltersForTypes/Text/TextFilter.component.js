// @flow
import React, { Component } from 'react';
import { Checkbox, MenuDivider } from '@dhis2/ui';
import i18n from '@dhis2/d2-i18n';
import { Input } from './Input.component';
import { getTextFilterData } from './textFilterDataGetter';
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
        this.props.onUpdate(value || null);
    };

    handleBlur = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleInputChange = (value: string) => {
        this.props.onCommitValue(value);
    };

    handleCheckboxChange = ({ checked }: {| checked: boolean |}) => {
        this.props.onCommitValue(checked ? null : '');
    };

    render() {
        const { value } = this.props;

        return (
            <>
                <div>
                    <Checkbox
                        label={i18n.t('Is empty')}
                        checked={value === null}
                        onChange={this.handleCheckboxChange}
                    />
                    <MenuDivider />
                </div>

                <Input
                    onChange={this.handleInputChange}
                    onBlur={this.handleBlur}
                    onEnterKey={this.handleEnterKey}
                    value={value ?? ''}
                />
            </>
        );
    }
}
