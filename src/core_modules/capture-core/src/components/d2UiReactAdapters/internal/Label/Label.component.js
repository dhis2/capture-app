// @flow
import React from 'react';
import classNames from 'classnames';
import defaultClasses from '../../../d2Ui/internal/label/label.mod.css';

type Classes = {
    label?: ?string,
};

type Props = {
    title: ?string,
    classes: Classes,
    labelRef?: ?(ref: any) => void,
    useVerticalOrientation: ?boolean,
};

class Label extends React.PureComponent<Props> {
    render() {
        const { classes, title, labelRef, useVerticalOrientation, ...passOnProps } = this.props;
        const labelContainerDefault =
            useVerticalOrientation ? defaultClasses.labelContainerVertical : defaultClasses.labelContainer;

        return (
            <div
                ref={labelRef}
                className={classNames(labelContainerDefault, classes.label)}
                {...passOnProps}
            >
                {title}
            </div>
        );
    }
}

export default Label;
