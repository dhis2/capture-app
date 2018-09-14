// @flow
import * as React from 'react';
import type { FieldConfig } from '../../__TEMP__/FormBuilderExternalState.component';

type Props = {
    fields: Array<FieldConfig>,
    onRenderField: (field: FieldConfig) => React.Element<any>,
};

class CustomForm extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <div>
                custom Form
            </div>
            );
    }
}

export default CustomForm;

