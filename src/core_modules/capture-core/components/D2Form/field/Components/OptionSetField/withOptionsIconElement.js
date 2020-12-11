// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

const getStyles = () => ({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingRight: 5,
    },
    icon: {
        width: 22,
        height: 22,
        borderRadius: 2,
    },
});

type Icon = {
    data: string,
    color: string,
};

type Props = {
    options: Array<{icon?: Icon}>,
    label?: ?string,
    classes: {
        iconContainer: string,
        icon: string,
    },
};

/**
 * Converts icon objects in options to React nodes, with property key iconRight.
*/

export default () =>
    (InnerComponent: React.ComponentType<any>) => withStyles(getStyles)(
        class CreateOptionsIconElementHOC extends React.Component<Props> {
            options: Array<{icon: React.Node}>;

            constructor(props: Props) {
                super(props);
                // $FlowFixMe
                this.options = this.getOptions();
            }

            getIcon(icon?: Icon) {
                const { label, classes } = this.props;
                return icon
                    ? (
                        <div
                            className={classes.iconContainer}
                        >
                            <img
                                style={{ backgroundColor: icon.color }}
                                className={classes.icon}
                                src={icon.data}
                                alt={label}
                            />
                        </div>
                    )
                    : null;
            }

            getOptions() {
                const { options } = this.props;
                return options
                    .map(option => ({
                        ...option,
                        iconRight: this.getIcon(option.icon),
                        iconLeft: null,
                    }));
            }

            render() {
                const { options, classes, ...passOnProps } = this.props;

                return (
                    // $FlowFixMe[cannot-spread-inexact] automated comment
                    <InnerComponent
                        options={this.options}
                        {...passOnProps}
                    />
                );
            }
        },
    );
