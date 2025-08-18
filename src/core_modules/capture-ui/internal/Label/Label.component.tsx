import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './label.module.css';

type Classes = {
    label?: string | null;
};

type Props = {
    children: React.ReactNode;
    classes: Classes;
    labelRef?: ((ref: any) => void) | null;
    useVerticalOrientation?: boolean | null;
};

export class Label extends React.PureComponent<Props> {
    render() {
        const { classes, children, labelRef, useVerticalOrientation, ...passOnProps } = this.props;
        const labelContainerDefault =
            useVerticalOrientation ? defaultClasses.labelContainerVertical : defaultClasses.labelContainer;

        return (
            <div
                ref={labelRef}
                className={classNames(labelContainerDefault, classes.label)}
                {...passOnProps}
            >
                {children}
            </div>
        );
    }
}
