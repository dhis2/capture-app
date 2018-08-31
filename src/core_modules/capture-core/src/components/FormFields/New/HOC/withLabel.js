// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import withLabel from '../../../d2UiReactAdapters/HOC/withLabel';

const getStyles = (theme: Theme) => ({
    label: {
        color: theme.palette.text.primary,
        paddingBottom: 4,
    },
    labelVertical: {
        color: theme.palette.text.primary,
    },
    required: {
        color: theme.palette.required,
    },
});

type Props = {
    label: ?string,
    required: boolean,
    classes: {
        label: string,
        labelVertical: string,
        required: string,
    },
};

type HOCParams = {
    onGetUseVerticalOrientation?: ?() => boolean,
    onGetFieldLabelMediaClass?: ?() => string,
};

export default (hocParams?: ?HOCParams) => (InnerComponent: React.ComponentType<any>) => {
    const useVerticalOrientation = hocParams && hocParams.onGetUseVerticalOrientation && hocParams.onGetUseVerticalOrientation();
    const fieldLabelMediaBasedClass = hocParams && hocParams.onGetFieldLabelMediaClass && hocParams.onGetFieldLabelMediaClass();

    const LabelHOCWithStyles = withLabel({
        onGetUseVerticalOrientation: () => useVerticalOrientation,
        onSplitClasses: (classes) => {
            const { label, labelVertical, ...rest } = classes;
            return {
                labelContainer: null,
                labelClasses: {
                    label: useVerticalOrientation ? labelVertical : classNames(label, fieldLabelMediaBasedClass),
                },
                passOnClasses: rest,
            };
        },
    })(InnerComponent);

    const RequiredLabel = (props: Props) => (
        <span>
            {props.label}
            <span
                className={props.classes.required}
            >
                &nbsp;*
            </span>
        </span>
    );

    const ProjectLabelHOC = withStyles(getStyles)((props: Props) => {
        const { label, required, ...passOnProps } = props;
        return (
            <LabelHOCWithStyles
                label={required && label ? (<RequiredLabel {...props} />) : label}
                {...passOnProps}
            />
        );
    });

    return ProjectLabelHOC;
};
