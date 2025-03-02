// @flow
import * as React from 'react';

type Props = {
    offsetTop: number,
    minViewpointWidth: number,
    children: React.Node,
    containerClass?: ?string,
}

export class StickyOnScroll extends React.Component<Props> {
    stickyContainer: any;
    scrollTimer: any;
    resizeTimer: any;

    static defaultProps = {
        offsetTop: 0,
        minViewpointWidth: 0,
    }

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

    setStickyContainerInstance = (instance: HTMLDivElement | null) => {
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
        if (this.stickyContainer && (this.stickyDisabled() || !this.isNearTop())) {
            this.stickyContainer.className = 'sticky-container-absolute';
            this.stickyContainer.style.top = 'initial';
            this.stickyContainer.style.marginRight = 'initial';
            this.stickyContainer.style.width = 'initial';
            return;
        }
        if (this.stickyContainer && this.isAtBottomOfContainer()) {
            this.stickyContainer.className = 'sticky-container-at-bottom';
            this.stickyContainer.style.top = 'initial';
            this.stickyContainer.style.marginRight = 'initial';
            return;
        }
        if (this.stickyContainer) {
            this.stickyContainer.className = 'sticky-container-fixed';
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
        const { children, containerClass } = this.props;
        return (
            <div className={containerClass || 'container'}>
                <div ref={(stickyContainerInstance) => { this.setStickyContainerInstance(stickyContainerInstance); }}>
                    {children}
                </div>
                <style jsx>{`
                    .container {
                        position: relative;
                    }
                    .sticky-container-absolute {
                        position: static;
                    }
                    .sticky-container-fixed {
                        position: fixed;
                    }
                    .sticky-container-at-bottom {
                        position: absolute;
                        bottom: 0;
                    }
                `}</style>
            </div>
        );
    }
}

