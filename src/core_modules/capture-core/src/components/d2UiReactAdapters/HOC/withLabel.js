// @flow
import * as React from 'react';
import Label from '../internal/Label/Label.component';
import defaultClasses from '../../d2Ui/fieldContainer/fieldContainer.mod.css';

type LabelClasses = {
    label?: ?string,
};

type InputClasses = LabelClasses & Object;

type Props = {
    classes: ?InputClasses,
    label?: ?string,
    labelRef?: ?(ref: any) => void,
};

type ClassesFromHOCParamGetter = (props: Props) => ?LabelClasses;

type ClassesFromHOCParamGetterContainer = ?{
    onGetInitialClassesFromParam?: ?ClassesFromHOCParamGetter,
    onGetUpdatedClassesFromParam?: ?ClassesFromHOCParamGetter,
};

export default (classesFromParamGettersContainer: ?ClassesFromHOCParamGetterContainer) =>
    (InnerComponent: React.ComponentType<any>) =>
        class LabelHOC extends React.Component<Props> {
            labelClasses: LabelClasses;
            passOnClasses: ?Object;

            constructor(props: Props) {
                super(props);
                this.initClasses();
            }

            componentWillReceiveProps(newProps: Props) {
                const nextClasses = newProps.classes || {};
                const prevClasses = this.props.classes || {};

                if (classesFromParamGettersContainer && classesFromParamGettersContainer.onGetUpdatedClassesFromParam) {
                    const updatedClassesFromParam =
                        classesFromParamGettersContainer.onGetUpdatedClassesFromParam(newProps);

                    if (updatedClassesFromParam) {
                        this.setClasses({
                            ...updatedClassesFromParam,
                            ...nextClasses,
                        });
                        return;
                    }
                }

                this.updateClassesIfApplicableBasedOnProps(nextClasses, prevClasses);
            }

            initClasses() {
                let classes = this.props.classes || {};

                if (classesFromParamGettersContainer && classesFromParamGettersContainer.onGetInitialClassesFromParam) {
                    classes =
                        { ...classesFromParamGettersContainer.onGetInitialClassesFromParam(this.props), ...classes };
                }

                this.setClasses(classes);
            }

            updateClassesIfApplicableBasedOnProps(nextClasses: LabelClasses, prevClasses: LabelClasses) {
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

            setClasses(classes: InputClasses) {
                const { label, ...passOnClasses } = classes;
                this.labelClasses = {
                    ...this.labelClasses,
                    label,
                };
                this.passOnClasses = passOnClasses;
            }

            getLabelElement(label: ?string, labelRef: ?(ref: any) => void) {
                return (
                    <Label
                        title={label}
                        labelRef={labelRef}
                        classes={this.labelClasses}
                    />
                );
            }

            render() {
                const { label, labelRef, classes, ...passOnProps } = this.props;
                const labelElement = this.getLabelElement(label, labelRef);

                return (
                    <div
                        className={defaultClasses.container}
                    >
                        <div
                            className={defaultClasses.labelContainer}
                        >
                            {labelElement}
                        </div>
                        <div
                            className={defaultClasses.inputContainer}
                        >
                            <InnerComponent
                                labelElement={labelElement}
                                {...passOnProps}
                            />
                        </div>
                    </div>
                );
            }
        };
