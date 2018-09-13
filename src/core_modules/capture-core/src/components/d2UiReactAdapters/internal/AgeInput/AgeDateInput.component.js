// @flow
import * as React from 'react';
import TextInput from '../TextInput/TextInput.component';
import withInternalChangeHandler from '../../HOC/withInternalChangeHandler';

const AgeDateInput = (props: any) => (
    <D2Date
        value={props.date}
        onBlur={this.updateAgeByDateField}
        placeholder={i18n.t('mm/dd/yyyy')}
        width={350}
        calendarMaxMoment={moment()}
    />
);

export default withInternalChangeHandler()(AgeDateInput);
