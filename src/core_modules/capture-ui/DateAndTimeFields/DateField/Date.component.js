// @flow
import React, { createRef } from 'react';
import DatePopup from './DatePopup.component';
import DateCalendar from './DateCalendar.component';
import lowerCaseFirstLetter from '../../internal/utils/string/lowerCaseFirstLetter';
import DateInput from '../../internal/DateInput/DateInput.component';

type Props = {
    value: ?string,
    width: number,
    maxWidth?: ?number,
    calendarWidth?: ?number,
    calendarHeight?: ?number,
    inputWidth?: ?number,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    onDateSelectedFromCalendar?: () => void,
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
                accSplittedProps[propContainer][outputKey] = passOnProps[propKey];
                return accSplittedProps;
            }, splittedProps);
    }

    containerInstance: ?HTMLElement;
    handleTextFieldFocus: () => void;
    handleDateSelected: (value: string) => void;
    handleTextFieldBlur: (event: SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    hidePopover: () => void;
    handleDocumentClick: (event: MouseEvent) => void;
    calendarWrapperDOMElementRef: { current: ?HTMLDivElement };

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

        this.calendarWrapperDOMElementRef = createRef();
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    static propContainers = {
        CALENDAR: 'calendar',
        POPUP: 'popup',
        INPUT: 'input',
    };

    handleTextFieldFocus() {
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
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick({ target }: MouseEvent) {
        const calendarWrapperDOMElement = this.calendarWrapperDOMElementRef.current;

        if (!calendarWrapperDOMElement) {
            throw Error('calendar wrapper DOM element not found');
        }

        if (target === calendarWrapperDOMElement ||
            (target instanceof Node && calendarWrapperDOMElement.contains(target))) {
            return;
        }

        this.hidePopover();
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleTextFieldBlur({ relatedTarget, currentTarget }: SyntheticFocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const calendarWrapperDOMElement = this.calendarWrapperDOMElementRef.current;

        if (!calendarWrapperDOMElement) {
            throw Error('calendar wrapper DOM element not found');
        }

        if (relatedTarget === calendarWrapperDOMElement ||
            (relatedTarget instanceof Node && calendarWrapperDOMElement.contains(relatedTarget))) {
            document.addEventListener('click', this.handleDocumentClick);
        } else {
            this.props.onBlur(currentTarget.value);
            this.hidePopover();
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
            ...passOnProps
        } = this.props;
        const { popoverOpen } = this.state;
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
                { /* // $FlowFixMe */}
                {/* $FlowFixMe[prop-missing] automated comment */}
                <DateInput
                    onFocus={this.handleTextFieldFocus}
                    onBlur={this.handleTextFieldBlur}
                    width={calculatedInputWidth}
                    {...splittedPassOnProps.input}
                />
                <div
                    data-test={'date-calendar-wrapper'}
                    ref={this.calendarWrapperDOMElementRef}
                >
                    { /* // $FlowFixMe */}
                    {/* $FlowFixMe[prop-missing] automated comment */}
                    <DatePopup
                        open={popoverOpen}
                        onClose={this.hidePopover}
                        width={calculatedCalendarWidth}
                        height={calculatedCalendarHeight}
                        inputWidth={calculatedInputWidth}
                        inputUsesFloatingLabel={!!splittedPassOnProps.input.label}
                        {...splittedPassOnProps.popup}
                    >
                        { /* // $FlowFixMe */}
                        {/* $FlowFixMe[prop-missing] automated comment */}
                        <DateCalendar
                            onDateSelected={this.handleDateSelected}
                            value={this.props.value}
                            currentWidth={calculatedCalendarWidth}
                            height={calculatedCalendarHeight}
                            {...splittedPassOnProps.calendar}
                        />
                    </DatePopup>
                </div>
            </div>
        );
    }
}

export default UIDate;
