// @flow
/*
import * as React from 'react';
import { connect } from 'react-redux';
import { updateDataEntryField } from '../actions/dataEntry.actions';

type Props = {

};

type Validator = (value: any) => boolean;

type ValidatorContainer = {
    validator: Validator,
    message: string,
};

type Settings = {
    component: React.ComponentType<any>,
    componentProps?: ?Object,
    propName: string,
    validators?: ?Array<ValidatorContainer>,
};

type SettingsFn = (props: Props) => Settings;

const getEventField = (InnerComponent: React.ComponentType<any>, settingsFn?: ?SettingsFn) =>
    class EventFieldBuilder extends React.Component<Props> {

    }
;

const mapStateToProps = (state: ReduxState, props: { id: string }) => ({
    eventId: state.dataEntry && state.dataEntry[props.id] && state.dataEntry[props.id].eventId,
});

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (value: any) => updateDataEntryField
});

export default (settingsFn?: ?SettingsFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(getEventField(InnerComponent, settingsFn));
*/
