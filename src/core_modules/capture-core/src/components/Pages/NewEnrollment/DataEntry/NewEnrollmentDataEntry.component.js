// @flow
import * as React from 'react';

type Props = {};

class NewEnrollmentDataEntry extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <div>
                New enrollment data entry
            </div>
        );
    }
}

export default NewEnrollmentDataEntry;
