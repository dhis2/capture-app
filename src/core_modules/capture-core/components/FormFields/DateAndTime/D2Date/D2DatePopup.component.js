// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { anchorPositions, modes, absoluteDirections } from './d2DatePopup.const';

const getStyles = () => ({
    containerAbsolute: {
        position: 'relative',
    },
    containerInline: {},
    calendarAbsolute: {
        position: 'absolute',
        zIndex: 201,
    },
    calendarInline: {},
});

type Props = {
    open: boolean,
    children: React.Node,
    anchorPosition?: $Values<typeof anchorPositions>,
    mode?: $Values<typeof modes>,
    absoluteDirection: $Values<typeof absoluteDirections>,
    inputWidth: number,
    calendarWidth: number,
    classes: {
        containerAbsolute: string,
        containerInline: string,
        calendarAbsolute: string,
        calendarInline: string,
    },
    inputUsesFloatingLabel: boolean,
};

class D2DatePopup extends React.Component<Props> {
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
            classes,
            children,
        } = this.props;

        if (!open) {
            return null;
        }

        const containerClasses = mode === modes.INLINE ? classes.containerInline : classes.containerAbsolute;
        const calendarClasses = mode === modes.INLINE ? classes.calendarInline : classes.calendarAbsolute;
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

export default withStyles(getStyles)(D2DatePopup);
