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
});

const getStylesLabel = (theme: Theme) => ({
    container: {
        display: 'flex',
        alignItems: 'center',
    },
    required: {
        color: theme.palette.required,
    },
    iconContainer: {
        paddingLeft: 5,
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        width: 22,
        height: 22,
        borderRadius: 2,
    },
});

type IconType = { data: string, color: string };

type IconProps = {
    icon: ?IconType,
    label: ?string,
    iconClass: string,
};

type CalculatedLabelProps = {
    label: string,
    required: boolean,
    requiredClass: string,
};

type RequiredLabelProps = {
    label: string,
    requiredClass: string,
};

type Props = {
    label: ?string,
    required: boolean,
    icon: ?IconType,
    classes: {
        container: string,
        label: string,
        labelVertical: string,
        required: string,
        iconContainer: string,
        icon: string,
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

    const RequiredLabel = (props: RequiredLabelProps) => (
        <span>
            {props.label}
            <span
                className={props.requiredClass}
            >
                &nbsp;*
            </span>
        </span>
    );

    const Icon = (props: IconProps) => {
        const { icon, label, iconClass } = props;
        if (!icon) {
            return null;
        }
        return (
            <img
                className={iconClass}
                src={icon.data}
                style={{ backgroundColor: icon.color }}
                alt={`Icon for ${label || ''}`}
            />
        );
    };

    const CalculatedLabel = (props: CalculatedLabelProps) => {
        const { label, required } = props;
        return required && label
            ? (
                <RequiredLabel
                    {...props}
                />
            )
            : label;
    };

    const Label = (props: Props) => {
        const { label, required, icon, classes } = props;

        return (
            <div
                className={classes.container}
            >
                <CalculatedLabel
                    label={label || ''}
                    required={required}
                    requiredClass={classes.required}
                />
                <div
                    className={classes.iconContainer}
                >
                    <Icon
                        icon={icon}
                        label={label}
                        iconClass={classes.icon}
                    />
                </div>
            </div>
        );
    };
    const LabelWithStyles = withStyles(getStylesLabel)(Label);

    const ProjectLabelHOC = withStyles(getStyles)((props: Props) => {
        const { label, required, icon, ...passOnProps } = props;
        const { classes, ...propsWithoutClasses } = props;
        return (
            // $FlowFixMe[cannot-spread-inexact] automated comment
            <LabelHOCWithStyles
                label={(<LabelWithStyles {...propsWithoutClasses} />)}
                {...passOnProps}
            />
        );
    });

    return ProjectLabelHOC;
};
