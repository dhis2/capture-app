// @flow
import React, { Component } from 'react';

import programCollection from 'capture-core/metaData/programCollection/programCollection';
import D2Form from 'capture-core/components/D2Form/D2Form.component';
import ProgressButton from 'capture-core/components/Buttons/ProgressButton.component';
import { buttonStates } from 'capture-core/components/Buttons/progressButton.const';
import { getTranslation } from 'capture-core/d2/d2Instance';
import { formatterOptions } from 'capture-core/utils/string/format.const';


type Props = {
    eventId: string,
};

const styles = theme => ({

});

class EventCaptureForm extends Component<Props> {
    formInstance: ?D2Form;
    handleCompletionAttempt: () => void;
    
    constructor(props: Props) {
        super(props);
        this.handleCompletionAttempt = this.handleCompletionAttempt.bind(this);
    }

    handleCompletionAttempt() {
        if (this.formInstance) {
            const valid = this.formInstance.validateForm();
            if (valid) {
                console.log("valid");
            } else {
                console.log("invalid");
            } 
        }
    }

    render() {
        const { eventId } = this.props;

        return (
            <div>
                <D2Form
                    ref={(formInstance) => { this.formInstance = formInstance; }}
                    metaDataStage={programCollection.get('WSGAb5XwJ3Y').getStage('edqlbukwRfQ')}
                    dataId={eventId}
                />
                <div>
                    <ProgressButton
                        buttonState={buttonStates.READY}
                        raised
                        color="primary"
                        onClick={this.handleCompletionAttempt}
                    >
                        { getTranslation('complete', formatterOptions.CAPITALIZE) }
                    </ProgressButton>
                </div>
            </div>
        );
    }
}

export default EventCaptureForm;
