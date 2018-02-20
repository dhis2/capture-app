// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import isDefined from 'd2-utilizr/lib/isDefined';
import { updateField } from '../actions/dataEntry.actions';
import getDataEntryKey from '../common/getDataEntryKey';

type Validator = (value: any) => boolean;

type ValidatorContainer = {
    validator: Validator,
    message: string,
};

type Settings = {
    component: React.ComponentType<any>,
    componentProps?: ?Object,
    propName: string,
    validatorContainers?: ?Array<ValidatorContainer>,
};

type ValueMetaUpdateOutput = {
    validationError: ?string,
    isValid: boolean,
    touched: boolean,
};

type ValueMetaInput = {
    validationError: ?string,
    isValid: boolean,
    touched: boolean,
    type: string,
};

type Props = {
    value: any,
    valueMeta: ValueMetaInput,
    settings: Settings,
    id: string,
    eventFields?: ?Array<React.Element<any>>,
    onUpdateField: (value: any, valueMeta: ValueMetaUpdateOutput, fieldId: string, dataEntryId: string, eventId: string) => void,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
    eventId: string,
};

type Options = {
    touched?: ?boolean,
};

const getEventField = (InnerComponent: React.ComponentType<any>) =>
    class EventFieldBuilder extends React.Component<Props> {
        handleBlur: (value: any, options?: ?Options) => void;
        innerInstance: any;
        gotoInstance: any;
        constructor(props: Props) {
            super(props);
            this.handleBlur = this.handleBlur.bind(this);
        }

        getWrappedInstance() {
            return this.innerInstance;
        }

        validateAndScrollToIfFailed() {
            const isValid = this.props.valueMeta && this.props.valueMeta.isValid;

            if (!isValid) {
                this.goto();
            }

            return isValid;
        }

        goto() {
            if (this.gotoInstance) {
                this.gotoInstance.scrollIntoView();

                const scrolledY = window.scrollY;
                if (scrolledY) {
                    // TODO: Set the modifier some other way (caused be the fixed header)
                    window.scroll(0, scrolledY - 48);
                }
            }
        }

        getValidationErrors(value: any) {
            const validatorContainers = this.props.settings.validatorContainers;

            if (!validatorContainers) {
                return [];
            }

            return validatorContainers.reduce((accErrors, validatorContainer) => {
                const validator = validatorContainer.validator;
                const isValid = validator(value);
                if (!isValid) {
                    accErrors.push(validatorContainer.message);
                }
                return accErrors;
            }, []);
        }

        handleBlur(value: any, options?: ?Options) {
            const validationErrors = this.getValidationErrors(value);
            this.props.onUpdateField(value, {
                isValid: validationErrors.length === 0,
                validationError: validationErrors.length > 0 ? validationErrors[0] : null,
                touched: options && options.touched != null ? options.touched : true,
            }, this.props.settings.propName, this.props.id, this.props.eventId);
        }

        getFieldElement() {
            const { settings, value, valueMeta, completionAttempted, saveAttempted } = this.props;
            const { isValid, type, ...passOnValueMeta } = valueMeta;
            return (
                <div
                    ref={(gotoInstance) => { this.gotoInstance = gotoInstance; }}
                    key={settings.propName}
                >
                    <settings.component
                        onBlur={this.handleBlur}
                        value={value}
                        validationAttempted={!!(completionAttempted || saveAttempted)}
                        {...passOnValueMeta}
                        {...settings.componentProps}
                    />
                </div>
            );
        }

        getEventFields() {
            const eventFields = this.props.eventFields;
            return eventFields ? [...eventFields, this.getFieldElement()] : [this.getFieldElement()];
        }

        render() {
            const { settings, value, valueMeta, eventFields, eventId, onUpdateField, ...passOnProps } = this.props;

            return (
                <div>
                    <InnerComponent
                        ref={(innerInstance) => { this.innerInstance = innerInstance; }}
                        eventFields={this.getEventFields()}
                        {...passOnProps}
                    />
                </div>
            );
        }
    }
;

type ContainerProps = {
    id: string,
    eventFields?: ?Array<React.Element<any>>,
    completionAttempted?: ?boolean,
    saveAttempted?: ?boolean,
};

type SettingsFn = (props: ContainerProps) => Settings;

const getMapStateToProps = (settingsFn: SettingsFn) => (state: ReduxState, props: ContainerProps) => {
    const settings = settingsFn(props);
    const eventId = state.dataEntries[props.id].eventId;
    const key = getDataEntryKey(props.id, eventId);

    return {
        value: state.dataEntriesValues[key][settings.propName],
        valueMeta: state.dataEntriesValuesMeta[key][settings.propName],
        eventId,
        settings,
    };
};

const mapDispatchToProps = (dispatch: ReduxDispatch) => ({
    onUpdateField: (value: any, valueMeta: ValueMetaUpdateOutput, fieldId: string, dataEntryId: string, eventId: string) => {
        dispatch(updateField(value, valueMeta, fieldId, dataEntryId, eventId));
    },
});

export default (settingsFn: SettingsFn) =>
    (InnerComponent: React.ComponentType<any>) =>
        connect(getMapStateToProps(settingsFn), mapDispatchToProps, null, { withRef: true })(getEventField(InnerComponent));

