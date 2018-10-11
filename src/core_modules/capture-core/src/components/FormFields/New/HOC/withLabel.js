// @flow
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { withLabel as UIWithLabel } from 'capture-ui';

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
    onGetUseVerticalOrientation?: ?(props: Object) => boolean,
    onGetCustomFieldLabeClass?: ?(props: Object) => string,
};

export default (hocParams?: ?HOCParams) => (InnerComponent: React.ComponentType<any>) => {
    const onGetUseVerticalOrientation = hocParams && hocParams.onGetUseVerticalOrientation;
    const onGetCustomFieldLabeClass = hocParams && hocParams.onGetCustomFieldLabeClass;

    const LabelHOCWithStyles = UIWithLabel({
        onGetUseVerticalOrientation: (props: Object) => onGetUseVerticalOrientation && onGetUseVerticalOrientation(props),
        onSplitClasses: (classes, props: Object) => {
            const { label, labelVertical, ...rest } = classes;
            const useVerticalOrientation = onGetUseVerticalOrientation && onGetUseVerticalOrientation(props);
            return {
                labelContainer: null,
                labelClasses: {
                    label: useVerticalOrientation ? labelVertical : classNames(label, onGetCustomFieldLabeClass && onGetCustomFieldLabeClass(props)),
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
