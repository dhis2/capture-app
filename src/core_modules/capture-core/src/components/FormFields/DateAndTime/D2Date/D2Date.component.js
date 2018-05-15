// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

import D2TextField from '../../Generic/D2TextField.component';
import D2DatePopup from './D2DatePopup.component';
import D2DateCalendar from './D2DateCalendar.component';

type Props = {
    label: string,
    value: ?string,
    width: number,
    calendarWidth?: ?number,
    onBlur: (value: string) => void,
    onFocus?: ?() => void,
    classes: Object,
};

type State = {
    popoverOpen: boolean,
    popoverAnchorEl: ?HTMLElement
};

const styles = theme => ({
    textField: {
        width: '100%',
    },
});

class D2Date extends React.Component<Props, State> {
    containerInstance: ?HTMLElement;
    handleTextFieldFocus: () => void;
    handleDateSelected: (value: string) => void;
    handleTextFieldBlur: (value: string) => void;
    hidePopover: () => void;
    handleDocumentClick: (event: UiEventData) => void;

    constructor(props: Props) {
        super(props);

        this.state = {
            popoverOpen: false,
            popoverAnchorEl: null,
        };

        this.handleTextFieldFocus = this.handleTextFieldFocus.bind(this);
        this.handleDateSelected = this.handleDateSelected.bind(this);
        this.handleTextFieldBlur = this.handleTextFieldBlur.bind(this);
        this.hidePopover = this.hidePopover.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleTextFieldFocus() {
        document.removeEventListener('click', this.handleDocumentClick);

        this.setState({
            popoverOpen: true,
            popoverAnchorEl: this.containerInstance,
        });

        this.props.onFocus && this.props.onFocus();
    }

    handleDateSelected(value: string) {
        this.props.onBlur(value);
        this.hidePopover();
        document.removeEventListener('click', this.handleDocumentClick);
    }

    handleDocumentClick(event) {
        if (!event.target.className || !event.target.className.startsWith('Cal__')) {
            this.hidePopover();
            document.removeEventListener('click', this.handleDocumentClick);
        }
    }

    handleTextFieldBlur(value: string, event) {
        this.props.onBlur(value);

        if (!event.relatedTarget || event.relatedTarget.className !== 'Cal__Container__root') {
            this.hidePopover();
        } else {
            document.addEventListener('click', this.handleDocumentClick);
        }
    }

    hidePopover() {
        this.setState({
            popoverOpen: false,
        });
    }


    render() {
        const { width, calendarWidth, classes, onBlur, onFocus, ...passOnToTextField } = this.props;
        const { popoverOpen, popoverAnchorEl } = this.state;

        return (
            <div
                ref={(containerInstance) => { this.containerInstance = containerInstance; }}
                style={{
                    width,
                }}
            >
                <D2TextField                    
                    onFocus={this.handleTextFieldFocus}
                    onBlur={this.handleTextFieldBlur}
                    className={classes.textField}
                    {...passOnToTextField}
                />
                <D2DatePopup
                    open={popoverOpen}
                    anchorEl={popoverAnchorEl}
                    onClose={this.hidePopover}
                >
                    <D2DateCalendar
                        onDateSelected={this.handleDateSelected}
                        value={this.props.value}
                        currentWidth={calendarWidth || width}
                    />
                </D2DatePopup>
            </div>
        );
    }
}

export default withStyles(styles)(D2Date);
