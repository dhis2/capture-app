// @flow
import * as React from 'react';
import classNames from 'classnames';
import { Label } from '../internal/Label/Label.component';
import defaultClasses from './withLabel.module.css';

type LabelHOCClasses = {
    labelContainerClass?: ?string,
};

type LabelClasses = {
    label?: ?string,
};

type SpiltClasses = LabelHOCClasses & {
    labelClasses?: ?LabelClasses,
    passOnClasses?: ?Object,
};

type Styles = {
    labelContainerStyle?: ?Object,
    inputContainerStyle?: ?Object,
};

type Props = {
    classes: ?Object,
    label?: ?string | ?React.Element<any>,
    labelRef?: ?(ref: any) => void,
    styles?: ?Styles,
};

type OnSplitClasses = (classes: Object, props: Props) => SpiltClasses;
type onGetUseVerticalOrientation = (props: Props) => ?boolean

type HOCParamsContainer = {
    onSplitClasses?: ?OnSplitClasses,
    onGetUseVerticalOrientation?: ?onGetUseVerticalOrientation,
};

export const withLabel = (hocParams: ?HOCParamsContainer) =>
    (InnerComponent: React.ComponentType<any>) =>
        (class LabelHOC extends React.Component<Props> {
            labelContainerClass: ?string;
            labelClasses: ?LabelClasses;
            passOnClasses: ?Object;

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

            setClasses(inputClasses: ?Object) {
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

            getLabelElement(label: ?string | React.Element<any>, labelRef: ?(ref: any) => void, useVerticalOrientation: ?boolean) {
                return (
                    <Label
                        labelRef={labelRef}
                        classes={this.labelClasses || {}}
                        useVerticalOrientation={useVerticalOrientation}
                    >
                        {
                            // $FlowFixMe[incompatible-type] automated comment
                            label
                        }
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
                const labelElement = this.getLabelElement(label, labelRef, useVerticalOrientation);

                const labelContainerClass =
                    useVerticalOrientation ? defaultClasses.labelContainerVertical : defaultClasses.labelContainer;
                const stylesContainer = styles || {};
                return (
                    <div
                        className={useVerticalOrientation ? defaultClasses.containerVertical : defaultClasses.container}
                    >
                        <div
                            className={classNames(labelContainerClass, this.labelContainerClass)}
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
