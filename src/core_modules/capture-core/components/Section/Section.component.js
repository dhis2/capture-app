// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: `1px solid ${theme.palette.grey.blueGrey}`,
  },
  mainActionButton: {
    position: 'absolute',
    right: 15,
    top: 30,
  },
});

type Props = {
  children?: ?React$Element<any>,
  style?: ?Object,
  contentStyle?: ?Object,
  mainActionButton?: ?React$Element<any>,
  header?: ?React$Element<any>,
  isCollapsed?: ?boolean,
  onChangeCollapseState?: ?() => void,
  extendedCollapsibility?: boolean,
  classes: any,
  className?: ?string,
};

class Section extends Component<Props> {
  getHeader() {
    const orgHeader = this.props.header;

    if (
      orgHeader &&
      orgHeader.type &&
      orgHeader.type.name === 'SectionHeaderSimple' &&
      this.props.onChangeCollapseState
    ) {
      const clonedHeader = React.cloneElement(orgHeader, {
        onChangeCollapseState: this.props.onChangeCollapseState,
        isCollapsed: this.props.isCollapsed,
        extendedCollapsibility: this.props.extendedCollapsibility,
      });
      return clonedHeader;
    }
    return orgHeader;
  }

  renderContents() {
    const { isCollapsed, contentStyle, mainActionButton, classes } = this.props;
    const showChildren = !isCollapsed;
    const accContentStyle = { ...contentStyle, ...(isCollapsed ? { display: 'none' } : null) };
    const mainActionButtonElement = mainActionButton ? (
      <div className={classes.mainActionButton}>{mainActionButton}</div>
    ) : null;

    return (
      <div>
        {this.getHeader()}
        <div style={accContentStyle}>
          {mainActionButtonElement}
          {(() => {
            if (showChildren) {
              return this.props.children;
            }
            return null;
          })()}
        </div>
      </div>
    );
  }

  render() {
    const { style, className } = this.props;
    const containerClass = classNames(this.props.classes.container, className);
    return (
      <div className={containerClass} style={style}>
        {this.renderContents()}
      </div>
    );
  }
}

export default withStyles(styles)(Section);
