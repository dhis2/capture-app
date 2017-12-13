// @flow
/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import FormBuilder from 'd2-ui/lib/forms/FormBuilder.component';

import TextField from './TextField.component';

class EventForm extends Component {
    buildTestFields() {
        const fieldTest1 = {
            name: 'LBNxoXdMnkv',
            value: '',
            component: TextField,
            props: {
                floatingLabelText: 'flytende tekstlabel',
                style: { width: '100%' },
                hintText: 'hint tekst',
                changeEvent: 'onBlur',
                multiLine: false,
            },
        };

        return [fieldTest1];
    }

    testUpdate(a,b,c,d,e) {
        var x = "gege";
    }

    handleUpdate(...attr) {
        var x = "gegeg";
    }

    render() {
        return (
            <div>
                <FormBuilder fields={this.buildTestFields()} onUpdateField={this.testUpdate} onUpdateFormStatus={this.handleUpdate} />
            </div>
        );
    }
}

EventForm.propTypes = {

};

export default EventForm;
