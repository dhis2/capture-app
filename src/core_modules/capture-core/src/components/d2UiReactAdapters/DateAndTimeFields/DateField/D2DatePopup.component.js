// @flow
import * as React from 'react';
import { anchorPositions, modes, absoluteDirections } from './d2DatePopup.const';
import defaultClasses from '../../../d2Ui/dateAndTimeFields/datePopup.mod.css';

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

class D2DatePopup extends React.Component<Props> {
    getAbsoluteBottom() {
        const inputUsesFloatingLabel = this.props.inputUsesFloatingLabel;
        return inputUsesFloatingLabel ? 60 : 40;
    }
    getAbsoluteVerticalPosition() {
        const absoluteDirection = this.props.absoluteDirection;
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
            calendarStyle = mode === modes.INLINE ?
                { marginLeft: `-${this.calculateMarginLeftInline()}px` } :
                { ...this.getAbsoluteVerticalPosition(), right: 0 };
        } else {
            calendarStyle = mode === modes.INLINE ? { } : { ...this.getAbsoluteVerticalPosition(), left: 0 };
        }

        return calendarStyle;
    }

    render() {
        const {
            open,
            mode,
            anchorPosition, // eslint-disable-line
            absoluteDirection, // eslint-disable-line
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

export default D2DatePopup;
