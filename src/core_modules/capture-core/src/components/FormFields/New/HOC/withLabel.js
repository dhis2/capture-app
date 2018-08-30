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
});

type Props = {
    label: ?string,
    required: boolean,
};

type HOCParams = {
    onGetUseVerticalOrientation?: ?() => boolean,
    onGetFieldLabelMediaClass?: ?() => string,
};

export default (hocParams?: ?HOCParams) => (InnerComponent: React.ComponentType<any>) => {
    const useVerticalOrientation = hocParams && hocParams.onGetUseVerticalOrientation && hocParams.onGetUseVerticalOrientation();
    const fieldLabelMediaBasedClass = hocParams && hocParams.onGetFieldLabelMediaClass && hocParams.onGetFieldLabelMediaClass();

    const LabelHOCWithStyles = withStyles(getStyles)(
        withLabel({
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
        })(InnerComponent),
    );

    const ProjectLabelHOC = (props: Props) => {
        const { label, required, ...passOnProps } = props;
        return (
            <LabelHOCWithStyles
                label={required && label ? `${label} *` : label}
                {...passOnProps}
            />
        );
    };

    return ProjectLabelHOC;
};
