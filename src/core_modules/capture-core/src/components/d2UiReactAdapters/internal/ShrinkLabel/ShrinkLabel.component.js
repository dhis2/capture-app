// @inheritedComponent FormLabel

import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/shrinkLabel/shrinkLabel.mod.css';

export const styles = theme => ({
    /* Styles applied to the root element. */
    root: {
        transformOrigin: 'top left',
    },
    /* Styles applied to the root element if the component is a descendant of `FormControl`. */
    formControl: {
        position: 'absolute',
        left: 5,
        top: 0,
        // slight alteration to spec spacing to match visual spec result
        transform: 'translate(0, 26px) scale(1)',
    },
    /* Styles applied to the `input` element if `shrink={true}`. */
    shrink: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: 'top left',
    },
    /* Styles applied to the `input` element if `disableAnimation={false}`. */
    animated: {
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shorter,
            easing: theme.transitions.easing.easeOut,
        }),
    },
});

function InputLabel(props) {
    const {
        children,
        shrink,
    } = props;
    const className = classNames(defaultClasses.label, shrink ? defaultClasses.labelShrinked : defaultClasses.labelUnshrinked);
    return (
        <label className={className} style={{ zIndex: 11 }}>
            {children}
        </label>
    );
}

export default InputLabel;
