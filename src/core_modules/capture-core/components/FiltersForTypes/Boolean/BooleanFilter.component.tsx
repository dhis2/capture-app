import React, { Component } from 'react';

import { orientations } from '../../FormFields/Options/SelectBoxes';
import { D2TrueFalse } from '../../FormFields/Generic/D2TrueFalse.component';
import { getBooleanFilterData } from './booleanFilterDataGetter';
import type { UpdatableFilterContent } from '../types';
import { WithEmptyValueFilter } from '../EmptyValue';
import type { BooleanFilterProps, Value } from './boolean.types';

export class BooleanFilter extends Component<
    BooleanFilterProps
> implements UpdatableFilterContent<Value> {
    onGetUpdateData() {
        const { value } = this.props;
        return getBooleanFilterData(value);
    }

    onIsValid() { //eslint-disable-line
        return true;
    }

    handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && this.props.onUpdate) {
            this.props.onUpdate(this.props.value);
        }
    };

    setBooleanFieldInstance = (instance: D2TrueFalse | null) => {
        this.booleanFieldInstance = instance;
    }

    booleanFieldInstance: D2TrueFalse | null = null;

    render() {
        const { onCommitValue, value } = this.props;

        return (
            <WithEmptyValueFilter
                value={value}
                onCommitValue={onCommitValue}
                disabled={this.props.disableEmptyValueFilter}
            >
                {filteredValue => (
                    <div
                        onKeyDownCapture={this.handleKeyDown}
                    >
                        <D2TrueFalse
                            ref={this.setBooleanFieldInstance}
                            allowMultiple={this.props.allowMultiple}
                            value={filteredValue}
                            onBlur={onCommitValue}
                            orientation={orientations.VERTICAL}
                        />
                    </div>
                )}
            </WithEmptyValueFilter>
        );
    }
}
