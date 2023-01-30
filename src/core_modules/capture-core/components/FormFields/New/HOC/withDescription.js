// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconInfo16, Popover, colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

const getStylesLabel = () => ({
    iconContainer: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: spacers.dp4,
        padding: 2,
        borderRadius: 3,
        background: 'transparent',
        color: colors.grey700,
        '&:hover': {
            cursor: 'pointer',
            background: colors.grey200,
            color: colors.grey900,
        },
    },
    iconContainerActive: {
        background: colors.grey300,
        color: colors.grey900,
    },
    popOverContainer: {
        padding: `${spacers.dp12} ${spacers.dp12}`,
        wordBreak: 'break-word',
        '& + &': {
            paddingTop: 0,
        },
    },
    label: {
        fontWeight: 500,
        fontSize: 14,
        color: colors.grey900,
        paddingBottom: 4,
        margin: 0,
    },
    content: {
        fontSize: '14px',
        lineHeight: '18px',
        color: colors.grey900,
        margin: 0,
    },
    url: {
        fontSize: 14,
    },
});

type State = {
    popOverOpen: boolean
}
export const withDescription = () =>
    (InnerComponent: React.ComponentType<any>) =>
        withStyles(getStylesLabel)(class DataElementDescription extends React.Component<Object, State> {
            iconRef: any;

            constructor(props) {
                super(props);
                this.iconRef = React.createRef();
                this.state = {
                    popOverOpen: false,
                };
            }
            renderDescription(description, url) {
                const { classes } = this.props;
                return (<div>
                    <div
                        role="button"
                        tabIndex={-1}
                        ref={this.iconRef}
                        className={`${classes.iconContainer} ${this.state.popOverOpen ? classes.iconContainerActive : ''}`}
                        onClick={() => { this.setState({ popOverOpen: true }); }}
                    >
                        <IconInfo16 />
                    </div>
                    {this.state.popOverOpen &&
                    <Popover
                        reference={this.iconRef.current}
                        onClickOutside={() => this.setState({ popOverOpen: false })}
                    >
                        { description ? <div className={classes.popOverContainer}>
                            <p className={classes.label}>{i18n.t('Description')}</p>
                            <p className={classes.content}>{description}</p>
                        </div> : null}
                        {url ? <div className={classes.popOverContainer}>
                            <p className={classes.label}>{i18n.t('URL')}</p>
                            <a className={classes.url} href={url} target={'_blank'} rel="noreferrer">{url}</a>
                        </div> : null}
                    </Popover>}
                </div>);
            }

            render() {
                const { description, url, classes, ...passOnProps } = this.props;

                if (!description && !url) {
                    return <InnerComponent {...passOnProps} />;
                }

                return (
                    <InnerComponent
                        {...passOnProps}
                        dataElementDescription={this.renderDescription(description, url)}
                    />
                );
            }
        });

