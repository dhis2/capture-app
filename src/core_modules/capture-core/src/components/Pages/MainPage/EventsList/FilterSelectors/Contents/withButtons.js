// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import Button from '../../../../../Buttons/Button.component';
import type { Convertable } from '../../../../../FiltersForTypes/filters.types';

type Props = {
    OnUpdate: () => void,
    onClose: () => void,
};

export default () => (InnerComponent: React.ComponentType<any>) =>
    class FilterContentsButtons extends React.Component<Props> {
        filterTypeInstance: Convertable;
        onUpdate = () => {
            const { requestData, appliedText } = (this.filterTypeInstance.onConvert && this.filterTypeInstance.onConvert()) || {};
            this.props.onUpdate(requestData, appliedText);
        }

        setFilterTypeInstance = (filterTypeInstance: Convertable) => {
            this.filterTypeInstance = filterTypeInstance;
        }

        render() {
            const { onUpdate, onClose, ...passOnProps } = this.props;
            return (
                <React.Fragment>
                    <InnerComponent
                        filterTypeRef={this.setFilterTypeInstance}
                        {...passOnProps}
                    />
                    <Button
                        variant="raised"
                        color="secondary"
                        onClick={onClose}
                    >
                        {i18n.t('Close')}
                    </Button>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.onUpdate}
                    >
                        {i18n.t('Update')}
                    </Button>
                </React.Fragment>
            );
        }
    };
