
// @flow

import * as React from 'react';

type Props = {
    value?: ?any,
    valueConverter?: ?(value: any) => any,
}

class ViewModeField extends React.Component<Props> {
    render() {
        const { value, valueConverter } = this.props;
        const displayValue = valueConverter ? valueConverter(value) : value;

        return (
            <div>
                {displayValue}
            </div>
        );
    }
}

export default ViewModeField;
