// @flow
import * as React from 'react';

import TextInput from '../../internal/TextInput/TextInput.component';
import DatePopup from './DatePopup.component';
import DateCalendar from './DateCalendar.component';
import lowerCaseFirstLetter from '../../internal/utils/string/lowerCaseFirstLetter';
import DateInput from '../../internal/DateInput/DateInput.component';

type Props = {
    value: ?string,
    width: number,
    calendarWidth?: ?number,
    calendarHeight?: ?number,
    inputWidth?: ?number,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
    textFieldRef?: (instance: TextInput) => void,
};

type State = {
    popoverOpen: boolean,
};

class UIDate extends React.Component<Props, State> {
    static splitPassOnProps(passOnProps: ?Object) {
        const splittedProps = {
            input: {},
            popup: {},
            calendar: {},
        };

        if (!passOnProps) {
            return splittedProps;
        }

        return Object
            .keys(passOnProps)
            .reduce((accSplittedProps, propKey) => {
                let propContainer;
                if (propKey.startsWith(UIDate.propContainers.CALENDAR)) {
                    propContainer = UIDate.propContainers.CALENDAR;
                } else if (propKey.startsWith(UIDate.propContainers.POPUP)) {
                    propContainer = UIDate.propContainers.POPUP;
                } else {
                    propContainer = UIDate.propContainers.INPUT;
                }

                const outputKey = lowerCaseFirstLetter(propKey.replace(propContainer, ''));
                // $FlowSuppress
                accSplittedProps[propContainer][outputKey] = passOnProps[propKey];
                return accSplittedProps;
            }, splittedProps);
    }

    containerInstance: ?HTMLElement;
    handleTextFieldFocus: () => void;
    handleDateSelected: (value: string) => void;
    handleTextFieldBlur: (value: string) => void;
    hidePopover: () => void;
    handleDocumentClick: (event: SyntheticEvent<any>) => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            popoverOpen: false,
        };

        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleDateSelected = this.handleDateSelected.bind(this);
        this.handleTextFieldBlur = this.handleTextFieldBlur.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    componentWillUnmount() {
        // $FlowSuppress
        document.removeEventListener('click', this.handleDocumentClick);
    }

    static propContainers = {
        CALENDAR: 'calendar',
        POPUP: 'popup',
        INPUT: 'input',
    };

    handleTextFieldFocus() {
        // $FlowSuppress
        document.removeEventListener('click', this.handleDocumentClick);

        this.setState({
            popoverOpen: true,
        });

        this.props.onFocus && this.props.onFocus();
    }

    handleDateSelected(value: string) {
        this.props.onBlur(value);
        this.hidePopover();
        this.props.onDateSelectedFromCalendar && this.props.onDateSelectedFromCalendar();
        // $FlowSuppress
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(event) {
        if ((event.target && event.target.className &&
            event.target.className.startsWith &&
            event.target.className.startsWith('Cal__')) ||
            (event.target && event.target.className &&
            event.target.className.baseVal && event.target.className.baseVal.startsWith('Cal__'))) {
            return;
        }

        this.hidePopover();
        // $FlowSuppress
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleTextFieldBlur(event) {
        this.props.onBlur(event.currentTarget.value);

        if (!event.relatedTarget || event.relatedTarget.className !== 'Cal__Container__root') {
            this.hidePopover();
        } else {
            // $FlowSuppress
            document.addEventListener('click', this.handleDocumentClick);
        }
    }

    hidePopover() {
        this.setState({
            popoverOpen: false,
        });
    }

    render() {
        const {
            width,
            maxWidth,
            calendarWidth,
            calendarHeight,
            inputWidth,
            onBlur,
            onFocus,
            onDateSelectedFromCalendar,
            textFieldRef,
            ...passOnProps
        } = this.props;
        const { popoverOpen } = this.state;

        const textFieldRefPropObject = textFieldRef ? { ref: textFieldRef } : null;
        const calculatedInputWidth = inputWidth || width;
        const calculatedCalendarWidth = calendarWidth || width;
        const splittedPassOnProps = UIDate.splitPassOnProps(passOnProps);
        const calculatedCalendarHeight = calendarHeight || 350;

        return (
            <div
                ref={(containerInstance) => { this.containerInstance = containerInstance; }}
                style={{
                    width,
                    maxWidth,
                }}
            >
                { /* // $FlowSuppress */}
                <DateInput
                    {...textFieldRefPropObject}
                    onFocus={this.handleTextFieldFocus}
                    onBlur={this.handleTextFieldBlur}
                    classes={{}}
                    width={calculatedInputWidth}
                    {...splittedPassOnProps.input}
                />
                <DatePopup
                    open={popoverOpen}
                    onClose={this.hidePopover}
                    width={calculatedCalendarWidth}
                    height={calculatedCalendarHeight}
                    inputWidth={calculatedInputWidth}
                    inputUsesFloatingLabel={!!splittedPassOnProps.input.label}
                    {...splittedPassOnProps.popup}
                >
                    <DateCalendar
                        onDateSelected={this.handleDateSelected}
                        value={this.props.value}
                        currentWidth={calculatedCalendarWidth}
                        height={calculatedCalendarHeight}
                        {...splittedPassOnProps.calendar}
                    />
                </DatePopup>
            </div>
        );
    }
}

export default UIDate;
