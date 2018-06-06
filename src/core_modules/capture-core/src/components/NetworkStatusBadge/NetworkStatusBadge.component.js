import { connect } from 'react-redux';

import React, { PureComponent } from 'react';

import Sync from '@material-ui/icons/Sync';
import Grow from '@material-ui/core/Grow'
import { withStyles } from '@material-ui/core/styles';

const leftStyle = {
    padding: '8px',
}

const offlineIcon = {
    backgroundColor: '#9e9e9e',
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginRight: '6px',
}

const onlineIcon = {
    backgroundColor: '#48a999',
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    display: 'inline-block',
    marginRight: '6px',
}

const styles = theme => ({
    badgeContainer: {
        backgroundColor: '#16486e',
        color: 'white',
        borderRadius: '4px',
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
        <OnlineIcon state={props.status} />
        <p className={props.classes.text}>{ props.status ? 'Online' : 'Offline' }</p>
    </div>

const LeftSection = (props) => {
    let content

    if (props.status && props.syncList.length === 0) {
        return null
    }

    if (props.status && props.syncList.length > 0) {
        content = (
            <div className={props.classes.flex}>
                <Sync className={props.classes.icon}/>
                <p className={props.classes.text}>Syncing</p>
            </div>
        )
    }

    if (!props.status) {
        content = <span>{props.syncList.length} offline events. Last sync X ago</span>
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
    

const OnlineIcon = (props) => <span style={props.state ? onlineIcon : offlineIcon}></span>

class NetworkStatusBadge extends PureComponent {
    render () {
        const status = this.props.offline || {};
        const classes = this.props.classes;

        //const itemsToSync = status.outbox;
        const itemsToSync = [1,2,3];

        return (
            <div className={`${classes.flex} ${classes.badgeContainer}`}>
                <LeftSection status={status.online} syncList={itemsToSync} classes={classes}/>
                <RightSection status={status.online} syncList={itemsToSync} classes={classes}/>
            </div>
        )
    }                           
}

const mapStateToProps = (state: ReduxState) => ({
    offline: state.offline
});

export default connect(mapStateToProps)(withStyles(styles)(NetworkStatusBadge));
