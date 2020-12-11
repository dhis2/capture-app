// @flow
import * as React from 'react';
import { anchorPositions, modes, absoluteDirections } from './datePopup.const';
import defaultClasses from './datePopup.module.css';

type Props = {
    open: boolean,
    children: React.Node,
    anchorPosition?: $Values<typeof anchorPositions>,
    mode?: $Values<typeof modes>,
    absoluteDirection: $Values<typeof absoluteDirections>,
    inputWidth: number,
    calendarWidth: number,
    inputUsesFloatingLabel: boolean,
};

class DatePopup extends React.Component<Props> {
    getAbsoluteBottom() {
        const {inputUsesFloatingLabel} = this.props;
        return inputUsesFloatingLabel ? 60 : 40;
    }

    getAbsoluteVerticalPosition() {
        const {absoluteDirection} = this.props;
        return absoluteDirection === absoluteDirections.UP ? { bottom: this.getAbsoluteBottom() } : { top: 0 };
    }

    calculateMarginLeftInline() {
        const { inputWidth, calendarWidth } = this.props;
        return calendarWidth - inputWidth;
    }

    getPopupStyle() {
        const { anchorPosition, mode } = this.props;

        let calendarStyle;
        if (anchorPosition === anchorPositions.RIGHT) {
            calendarStyle = this.getRightCalendarStyle(mode);
        } else if (anchorPosition === anchorPositions.CENTER) {
            calendarStyle = this.getCenterCalendarStyle(mode);
        } else {
            calendarStyle = this.getLeftCalendarStyle(mode);
        }
        return calendarStyle;
    }

    getRightCalendarStyle = (mode: ?$Values<typeof modes>) =>
        (mode === modes.INLINE ?
            { marginLeft: `-${this.calculateMarginLeftInline()}px` } :
            { ...this.getAbsoluteVerticalPosition(), right: 0 }
        );

    getLeftCalendarStyle = (mode: ?$Values<typeof modes>) =>
        (mode === modes.INLINE ? { } : { ...this.getAbsoluteVerticalPosition(), left: 0 });

    getCenterCalendarStyle = (mode: ?$Values<typeof modes>) =>
        (mode === modes.INLINE ?
            { marginLeft: `-${(this.calculateMarginLeftInline() / 2)}px` } :
            { ...this.getAbsoluteVerticalPosition(), left: '50%', transform: 'translate(-50%, 0)' }
        );

    render() {
        const {
            open,
            mode,
            children,
        } = this.props;

        if (!open) {
            return null;
        }

        const containerClasses = mode === modes.INLINE ? defaultClasses.containerInline : defaultClasses.containerAbsolute;
        const calendarClasses = mode === modes.INLINE ? defaultClasses.calendarInline : defaultClasses.calendarAbsolute;
        const calendarStyle = this.getPopupStyle();

        return (
            <div
                className={containerClasses}
            >
                <div
                    className={calendarClasses}
                    style={calendarStyle}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default DatePopup;
