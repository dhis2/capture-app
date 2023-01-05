// @flow
import * as React from 'react';
import classNames from 'classnames';
import i18n from '@dhis2/d2-i18n';
import { IconInfo16, Tooltip, colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';
import { withLabel as UIWithLabel } from 'capture-ui';
import { NonBundledDhis2Icon } from '../../../NonBundledDhis2Icon';
import { withDescription } from './withDescription';

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
    tooltipIcon: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: spacers.dp8,
        cursor: 'pointer',
    },
});

type IconType = { name?: string, color?: string };

type IconProps = {
    icon: ?IconType,
    label: ?string,
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
        tooltipIcon: string,
    },
    dataElementDescription?: ?React.Element<any>
};

type HOCParams = {
    onGetUseVerticalOrientation?: ?(props: Object) => boolean,
    onGetCustomFieldLabeClass?: ?(props: Object) => string,
    customTooltip?: ?(props: Object) => string
};

export const withLabel = (hocParams?: ?HOCParams) => (InnerComponent: React.ComponentType<any>) => {
    const onGetUseVerticalOrientation = hocParams && hocParams.onGetUseVerticalOrientation;
    const onGetCustomFieldLabeClass = hocParams && hocParams.onGetCustomFieldLabeClass;
    const customTooltip = hocParams && hocParams.customTooltip;

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
        const { icon, label } = props;
        if (!icon) {
            return null;
        }

        return (
            <NonBundledDhis2Icon
                name={icon.name}
                color={icon.color}
                alternativeText={i18n.t('Icon for {{field}}', { field: label || '', interpolation: { escapeValue: false } })}
                cornerRadius={2}
                width={22}
                height={22}
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
        const { label, required, icon, classes, dataElementDescription } = props;
        return (
            <div
                className={classes.container}
            >
                <div
                    className={classes.iconContainer}
                >
                    <Icon
                        icon={icon}
                        label={label}
                    />
                </div>
                <CalculatedLabel
                    label={label || ''}
                    required={required}
                    requiredClass={classes.required}
                />
                {customTooltip ?
                    <Tooltip content={customTooltip()}>
                        <div className={classes.tooltipIcon}>
                            <IconInfo16 color={colors.grey600} />
                        </div>
                    </Tooltip>
                    :
                    dataElementDescription
                }
            </div>
        );
    };
    const LabelWithStyles = withDescription()(withStyles(getStylesLabel)(Label));
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
