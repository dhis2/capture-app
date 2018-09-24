// @inheritedComponent FormLabel

import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/shrinkLabel/shrinkLabel.mod.css';

function InputLabel(props) {
    const {
        children,
        shrink,
    } = props;
    const className = classNames(defaultClasses.label, shrink ? defaultClasses.labelShrinked : defaultClasses.labelUnshrinked);
    return (
        <div className={className}>
            {children}
        </div>
    );
}

export default InputLabel;
