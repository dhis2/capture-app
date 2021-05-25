// @flow
import * as React from 'react';
import classNames from 'classnames';
import defaultClasses from './label.module.css';

type Classes = {
    label?: ?string,
};

type Props = {
    children: React.Node,
    classes: Classes,
    labelRef?: ?(ref: any) => void,
    useVerticalOrientation: ?boolean,
};

export class Label extends React.PureComponent<Props> {
    render() {
        const { classes, children, labelRef, useVerticalOrientation, ...passOnProps } = this.props;
        const labelContainerDefault =
            useVerticalOrientation ? defaultClasses.labelContainerVertical : defaultClasses.labelContainer;

        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
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
