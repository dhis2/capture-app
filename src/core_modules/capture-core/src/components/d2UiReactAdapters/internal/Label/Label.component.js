// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/label/label.mod.css';

type Classes = {
    label: ?string,
};

type Props = {
    title: ?string,
    classes: Classes,
    labelRef?: ?(ref: any) => void,
};

class Label extends React.PureComponent<Props> {
    render() {
        const { classes, title, labelRef, ...passOnProps } = this.props;

        return (
            <div
                ref={labelRef}
                className={classNames(defaultClasses.labelContainer, classes.label)}
                {...passOnProps}
            >
                {title}
            </div>
        );
    }
}

export default Label;
