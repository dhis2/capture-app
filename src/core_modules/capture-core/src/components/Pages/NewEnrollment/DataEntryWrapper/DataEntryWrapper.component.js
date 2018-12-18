// @flow
import * as React from 'react';
import DataEntry from '../DataEntry/DataEntry.container';

type Props = {

};

class DataEntryWrapper extends React.Component<Props> {
    render() {
        const { ...passOnProps } = this.props;
        return (
            <DataEntry
                {...passOnProps}
            />
        );
    }
}

export default DataEntryWrapper;
