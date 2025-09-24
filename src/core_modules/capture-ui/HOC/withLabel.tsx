import * as React from 'react';
import { cx } from '@emotion/css';
import { Label } from '../internal/Label/Label.component';
import defaultClasses from './withLabel.module.css';

type LabelHOCClasses = {
    labelContainerClass?: string;
};

type LabelClasses = {
    label?: string;
};

type SpiltClasses = LabelHOCClasses & {
    labelClasses?: LabelClasses;
    passOnClasses?: any;
};

type Styles = {
    labelContainerStyle?: any;
    inputContainerStyle?: any;
};

type Props = {
    classes?: any;
    label?: string | React.ReactElement;
    labelRef?: (ref: any) => void;
    styles?: Styles;
};

type OnSplitClasses = (classes: any, props: Props) => SpiltClasses;
type onGetUseVerticalOrientation = (props: Props) => boolean;

type HOCParamsContainer = {
    onSplitClasses?: OnSplitClasses;
    onGetUseVerticalOrientation?: onGetUseVerticalOrientation;
};

export const withLabel = (hocParams?: HOCParamsContainer) =>
    (InnerComponent: React.ComponentType<any>) =>
        (class LabelHOC extends React.Component<Props> {
            labelContainerClass?: string;
            labelClasses?: LabelClasses;
            passOnClasses?: any;

            constructor(props: Props) {
                super(props);
                this.setClasses(props.classes);
            }

            UNSAFE_componentWillReceiveProps(newProps: Props) {
                const nextClasses = newProps.classes || {};
                const prevClasses = this.props.classes || {};

                if (Object.keys(nextClasses).length !== Object.keys(prevClasses).length) {
                    this.setClasses(nextClasses);
                } else if (
                    Object
                        .keys(nextClasses)
                        .some(nextKey => nextClasses[nextKey] !== prevClasses[nextKey])
                ) {
                    this.setClasses(nextClasses);
                }
            }

            setClasses(inputClasses?: any) {
                if (!inputClasses) {
                    return;
                }

                if (!hocParams || !hocParams.onSplitClasses) {
                    this.passOnClasses = inputClasses;
                    return;
                }

                const splitClasses = hocParams.onSplitClasses(inputClasses, this.props);
                this.labelContainerClass = splitClasses.labelContainerClass;
                this.labelClasses = splitClasses.labelClasses;
                this.passOnClasses = splitClasses.passOnClasses;
            }

            getLabelElement(label?: string | React.ReactElement, labelRef?: (ref: any) => void) {
                return (
                    <Label
                        labelRef={labelRef}
                        classes={this.labelClasses || {}}
                    >
                        {label}
                    </Label>
                );
            }

            render() {
                const {
                    label,
                    labelRef,
                    classes,
                    styles,
                    ...passOnProps
                } = this.props;
                const useVerticalOrientation =
                    hocParams && hocParams.onGetUseVerticalOrientation &&
                    hocParams.onGetUseVerticalOrientation(this.props);
                const labelElement = this.getLabelElement(label, labelRef);

                const labelContainerClass =
                    useVerticalOrientation ? defaultClasses.labelContainerVertical : defaultClasses.labelContainer;
                const stylesContainer = styles || {};
                return (
                    <div
                        className={useVerticalOrientation ? defaultClasses.containerVertical : defaultClasses.container}
                    >
                        <div
                            className={cx(labelContainerClass, this.labelContainerClass)}
                            style={stylesContainer.labelContainerStyle}
                        >
                            {labelElement}
                        </div>
                        <div
                            className={defaultClasses.inputContainer}
                            style={stylesContainer.inputContainerStyle}
                        >
                            <InnerComponent
                                {...this.passOnClasses}
                                {...passOnProps}
                            />
                        </div>
                    </div>
                );
            }
        });
