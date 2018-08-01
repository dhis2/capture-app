import React from 'react';
import cx from 'classnames';
import './styles.css';

function Node({
    label,
    value,
    open,
    depth,
    isSelected,
    children,
    onClick,
    onIconClick,
}) {
    const hasChildren = children && Array.isArray(children);
    let minWidth = depth * 20;
    if (!hasChildren) {
        minWidth += 7;
    }

    return (
        <div>
            <div
                role="button"
                tabIndex={-1}
                className={cx('label', {
                    selected: isSelected,
                })}
                onClick={() => onClick(value)}
            >
                <div style={{ minWidth }} />
                {hasChildren ? (
                    <div
                        role="button"
                        tabIndex={-1}
                        className="icon"
                        onClick={evt => onIconClick(evt, !open, value)}
                    >
                        {open ? '\u2212' : '\u002B'}
                    </div>
                ) : (
                    <div className="icon" />
                )}
                <div className="text">{label}</div>
            </div>
            {open && children && <div className="children">{children}</div>}
        </div>
    );
}

export default class Tree extends React.Component {
    updateState(list, open, value) {
        if (!Array.isArray(list)) {
            return list;
        }

        let found = false;
        for (let i = 0; i < list.length; i += 1) {
            if (list[i].value === value) {
                list[i].open = open;
                found = true;
            }

            if (!found && typeof list[i].children !== 'undefined') {
                this.updateState(list[i].children, open, value);
            }
        }

        return list;
    }

  onIconClick = (evt, open, value) => {
      evt.stopPropagation();
      const list = this.updateState(this.props.list, open, value);
      this.props.onIconClick(value, open, [...list]);
  }

  onClick = (value) => {
      const { multiple, selectable } = this.props;
      if (!selectable) {
          return;
      }

      let { selected } = this.props;
      const isSelected = selected ? selected.includes(value) : false;
      if (typeof multiple === 'undefined' || !multiple) {
          this.props.setSelected(isSelected ? [] : [value], !isSelected, value);
          return;
      }

      if (isSelected) {
          selected = selected.filter(v => v !== value);
      } else {
          selected = selected.slice(0);
          selected.push(value);
      }

      this.props.setSelected(selected, !isSelected, value);
  }

  node(list, depth = 0) {
      if (!Array.isArray(list)) {
          return null;
      }

      return list.map(({ open, label, value, children }) => (
          <Node
              key={`node-${value}`}
              depth={depth}
              open={open}
              label={label}
              value={value}
              onClick={this.onClick}
              onIconClick={this.onIconClick}
              isSelected={this.props.selected ? this.props.selected.includes(value) : false}
          >
              {children ? this.node(children, depth + 1) : null}
          </Node>
      ));
  }

  view() {
      return this.node(this.props.list);
  }

  render() {
      if (this.props.list.length === 0) {
          return null;
      }

      return (
          <div className="ou-tree-container">
              <label className="ou-tree-label">
                  {this.props.label}
                  {
                      this.props.required && (<span className="ou-tree-label-required"> *</span>)
                  }
              </label>
              <div className="ou-tree">{this.view()}</div>
          </div>
      );
  }
}
