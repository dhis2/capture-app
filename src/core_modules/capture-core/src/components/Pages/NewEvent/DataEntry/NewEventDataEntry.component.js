// @flow
import React, { Component } from 'react';
import DataEntry from 'capture-core/components/DataEntry/DataEntry.container';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';

type Props = {
    formFoundation: ?RenderFoundation,
    onUpdateField: (innerAction: ReduxAction<any, any>) => void,
};

class NewEventDataEntry extends Component<Props> {
    render() {
        const { formFoundation, onUpdateField } = this.props;
        return (
            <div>
                <DataEntry
                    id={'main'}
                    formFoundation={formFoundation}
                    onUpdateField={onUpdateField}
                />
            </div>
        );
    }
}


export default NewEventDataEntry;
