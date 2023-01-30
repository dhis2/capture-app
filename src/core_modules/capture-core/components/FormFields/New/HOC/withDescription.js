// @flow
import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { IconInfo16, Popover, colors, spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core/styles';

const getStylesLabel = () => ({
    iconContainer: {
        paddingLeft: spacers.dp8,
        '&:hover': {
            cursor: 'pointer',
        },
    },
    popOverContainer: {
        padding: `${spacers.dp8} ${spacers.dp12}`,
        wordBreak: 'break-word',
    },
    label: {
        fontWeight: 600,
        paddingBottom: 4,
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
                        className={classes.iconContainer}
                        onClick={() => { this.setState({ popOverOpen: true }); }}
                    >
                        <IconInfo16 color={colors.grey600} />
                    </div>
                    {this.state.popOverOpen &&
                    <Popover
                        reference={this.iconRef.current}
                        onClickOutside={() => this.setState({ popOverOpen: false })}
                    >
                        { description ? <div className={classes.popOverContainer}>
                            <div className={classes.label}>{i18n.t('Description')}</div>
                            <div>{description}</div>
                        </div> : null}
                        { url ? <div className={classes.popOverContainer}>
                            <div className={classes.label}>{i18n.t('URL')}</div>
                            <a href={url} target={'_blank'} rel="noreferrer">{url}</a>
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

