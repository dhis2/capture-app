// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';

type Props = {
    offsetTop: number,
    minViewpointWidth: number,
    children: React.Node,
    containerClass?: ?string,
    classes: {
        container: string,
        stickyContainerAbsolute: string,
        stickyContainerFixed: string,
        stickyContainerAtBottom: string,
    },
}

const styles = theme => ({
    container: {
        position: 'relative',
    },
    stickyContainerAbsolute: {
        position: 'static',
    },
    stickyContainerFixed: {
        position: 'fixed',
    },
    stickyContainerAtBottom: {
        position: 'absolute',
        bottom: 0,
    },
});

class StickyOnScroll extends React.Component<Props> {
    static defaultProps = {
        offsetTop: 0,
        minViewpointWidth: 0,
    }
    stickyContainer: any;
    scrollTimer: any;
    resizeTimer: any;

    componentDidMount() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('scroll', this.onScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('scroll', this.onScroll);
    }

    isNearTop = () => window.pageYOffset + this.props.offsetTop > this.stickyContainer.parentElement.offsetTop

    isAtBottomOfContainer = () => {
        const elementRect = this.stickyContainer.getBoundingClientRect();
        const parentRect = this.stickyContainer.parentElement.getBoundingClientRect();
        return parentRect.bottom <= elementRect.bottom && (this.stickyContainer.offsetTop - Math.abs(parentRect.top) < this.props.offsetTop);
    }

    stickyDisabled = () => {
        const width = document.documentElement ? document.documentElement.clientWidth : 0;
        const height = document.documentElement ? document.documentElement.clientHeight : 0;
        return (
            height - (this.props.offsetTop + this.stickyContainer.offsetHeight)) < 0 ||
            width < this.props.minViewpointWidth;
    }

    setStickyContainerInstance = (instance) => {
        this.stickyContainer = instance;
        this.setSticky();
    }

    getRightMargin = () => {
        const parentElement = this.stickyContainer.parentElement;
        const width = document.documentElement ? document.documentElement.clientWidth : 0;
        const rightParent = this.stickyContainer.parentElement.offsetLeft + parentElement.offsetWidth;
        return width - rightParent;
    }

    setSticky = () => {
        const classes = this.props.classes;
        if (this.stickyContainer && (this.stickyDisabled() || !this.isNearTop())) {
            this.stickyContainer.className = classes.stickyContainerAbsolute;
            this.stickyContainer.style.top = 'initial';
            this.stickyContainer.style.marginRight = 'initial';
            this.stickyContainer.style.width = 'initial';
            return;
        }
        if (this.stickyContainer && this.isAtBottomOfContainer()) {
            this.stickyContainer.className = classes.stickyContainerAtBottom;
            this.stickyContainer.style.top = 'initial';
            this.stickyContainer.style.marginRight = 'initial';
            return;
        }
        if (this.stickyContainer) {
            this.stickyContainer.className = classes.stickyContainerFixed;
            this.stickyContainer.style.top = `${this.props.offsetTop}px`;
            this.stickyContainer.style.width = `${this.stickyContainer.parentElement.clientWidth}px`;
            this.stickyContainer.style.marginRight = `${this.getRightMargin()}px`;
        }
    }

    onResize = () => {
        if (this.resizeTimer) {
            window.clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = window.setTimeout(this.setSticky, 250);
    }

    onScroll = () => {
        if (this.scrollTimer) {
            window.clearTimeout(this.scrollTimer);
        }
        this.scrollTimer = window.setTimeout(this.setSticky, 10);
    }


    render() {
        const { classes, children, containerClass } = this.props;
        return (
            <div className={containerClass || classes.container}>
                <div ref={(stickyContainerInstance) => { this.setStickyContainerInstance(stickyContainerInstance); }}>
                    {children}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(StickyOnScroll);
