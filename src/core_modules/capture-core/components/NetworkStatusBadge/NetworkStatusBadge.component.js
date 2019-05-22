import { connect } from 'react-redux';

import React, { PureComponent } from 'react';

import Sync from '@material-ui/icons/Sync';
import Grow from '@material-ui/core/Grow'
import { withStyles } from '@material-ui/core/styles';
import moment from '../../utils/moment/momentResolver';
import i18n from '@dhis2/d2-i18n';

const styles = theme => ({
    offlineIcon: {
        backgroundColor: '#9e9e9e',
        width: '8px',
        height: '8px',
        borderRadius: '4px',
        display: 'inline-block',
        marginRight: '6px',
    },
    onlineIcon: {
        backgroundColor: '#48a999',
        width: '8px',
        height: '8px',
        borderRadius: '4px',
        display: 'inline-block',
        marginRight: '6px',
    },
    badgeContainer: {
        backgroundColor: '#16486e',
        color: 'white',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
    },
    badgeSection: {
        padding: '8px',
    },
    badgeSeparator: {
        borderRight: '1px solid #0b3b60',
    },
    flex: {
        display: 'flex',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    icon: {
        animationName: 'Sync-spin',
        animationDuration: '1.5s',
        animationIterationCount: 'infinite',
        animationDelay: '250ms',
        animationDirection: 'reverse',
        width: '16px',
        height: '16px',
    },
    text: {
        margin: 0,
        padding: 0,
    },
    smallText: {
        fontSize: '14px',
    },
    '@keyframes Sync-spin': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' }
    },
});

const RightSection = (props) =>
    <div className={`${props.classes.flex} ${props.classes.badgeSection}`}>
        <OnlineIcon status={props.status ? props.classes.onlineIcon : props.classes.offlineIcon } />
        <p className={props.classes.text}>{ props.status ? i18n.t('Online') : i18n.t('Offline') }</p>
    </div>

class LeftSection extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {offlineTimer: moment(Date.now()).fromNow()}
    }

    componentDidUpdate (prevProps, prevState) {
        if (this.props.statusTimer === 0) {
            clearInterval(this.timer)
            this.timer = null
            this.setState({offlineTimer: moment(Date.now()).fromNow()})
            return
        }
        
        if (this.props.statusTimer > 0 && !this.timer) {
            this.timer = setInterval(() => {
                const t1 = moment(this.props.statusTimer).fromNow()
                this.setState({offlineTimer: t1})
            }, 60*1000)
            return
        }
    }

    render () {
        let props = this.props
        let content

        if (props.status && props.syncList.length === 0) {
            return null
        }

        if (props.status && props.syncList.length > 0) {
            content = (
                <div className={props.classes.flex}>
                    <Sync className={props.classes.icon}/>
                    <p className={props.classes.text}>{i18n.t('Syncing')}</p>
                </div>
            )
        }

        if (!props.status) {
            content = <span>{props.syncList.length} {i18n.t('offline events. Last synced:')} {this.state.offlineTimer}</span>
        }

        const show = !!content

        return (
            <Grow in={show} style={{ transformOrigin: 'right 50%' }}>
                <div className={`${props.classes.badgeSection} ${props.classes.smallText} ${props.classes.badgeSeparator}`} style={props.style}>
                    {content}
                </div>
            </Grow>
        )
    }
}

const OnlineIcon = (props) => <span className={props.status}></span>

class NetworkStatusBadge extends PureComponent {
    render () {
        const status = this.props.offline || {};
        const classes = this.props.classes;

        const itemsToSync = status.outbox;

        return (
            <div className={`${classes.flex} ${classes.badgeContainer}`}>
                <LeftSection status={status.online} syncList={itemsToSync} classes={classes} statusTimer={this.props.networkStatus.offlineSince}/>
                <RightSection status={status.online} syncList={itemsToSync} classes={classes}/>
            </div>
        )
    }                           
}

const mapStateToProps = (state: ReduxState) => ({
    offline: state.offline,
    networkStatus: state.networkStatus,
});

export default connect(mapStateToProps)(withStyles(styles)(NetworkStatusBadge));
