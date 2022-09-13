import React from 'react';
import { localeCompareStrings } from '../../../utils/localeCompareStrings';
import { Tree } from './Tree';

export class OrgUnitTree extends React.Component {
  state = {
      list: [],
      selected: this.props.value,
  }

  async UNSAFE_componentWillMount() {
      await this.fetchRoot();
  }

  UNSAFE_componentWillReceiveProps({ value }) {
      this.setState({ selected: value });
  }

  setSelected = (selected) => {
      this.setState({ selected });
      if (Array.isArray(selected) && selected.length > 0) {
          this.props.onBlur(selected[0]);
      } else {
          this.props.onBlur(null);
      }
  }

  onIconClick = async (value, open, list) => {
      this.setState({ list });

      if (open) {
          await this.fetchNode(value);
      }
  }

  fetchRoot = async () => {
      this.props.querySingleResource({
          resource: 'organisationUnits',
          params: {
              level: 1,
              paging: false,
              fields: 'id,path,displayName,children::isNotEmpty',
          },
      })
          .then((root) => {
              const { value: selectedPath } = this.props;

              const list = root.organisationUnits;
              this.setState({
                  list: list.map((item) => {
                      const { path, displayName } = item;
                      const open = selectedPath && selectedPath.startsWith(path) && selectedPath !== path;
                      if (open) {
                          this.fetchNode(path, true);
                      }

                      return {
                          open,
                          value: path,
                          label: displayName,
                          children: [],
                      };
                  }),
              });
          }).catch(() => {
              console.log('OrgUnitTree root fetch failed');
          });
  }

  fetchNode = async (path, opening = false) => {
      const id = path.substr(path.lastIndexOf('/') + 1);

      this.props.querySingleResource({
          resource: 'organisationUnits',
          params: {
              paging: false,
              filter: `id:in:[${id}]`,
              fields: ':all,displayName,path,children[id,displayName,path,children]',

          },
      }).then((r) => {
          const organisationUnits = r.organisationUnits;
          const units = organisationUnits[0].children;

          const items = [];
          for (const child of units) {
              const { value: selectedPath } = this.props;
              const children = child.children.length > 0 ? [] : null;
              let open = children !== null && selectedPath && selectedPath.startsWith(child.path);

              if (open && opening && selectedPath.substr(child.path.length).indexOf('/') > -1) {
                  this.fetchNode(child.path, opening);
              } else {
                  open = false;
              }

              items.push({
                  open,
                  children,
                  value: child.path,
                  label: child.displayName,
              });
          }
          items.sort(({ label: labelA }, { label: labelB }) => localeCompareStrings(labelA, labelB));

          const { list } = this.state;
          this.setChildren(path, items, list);
          this.setState({
              list: [...list],
          });
      }).catch((e) => {
          console.log('OrgUnitTree fetchNode failed');
          console.log(e);
      });
  }

  setChildren(path, children, list) {
      if (!Array.isArray(list)) {
          return;
      }

      for (let i = 0; i < list.length; i += 1) {
          if (list[i].value === path) {
              list[i].children = children.slice(0);
              return;
          }

          if (list[i].children && list[i].children.length > 0) {
              this.setChildren(path, children, list[i].children);
          }
      }
  }

  render() {
      const { label, selectable, required } = this.props;
      const { list, selected } = this.state;

      return (
          <Tree
              required={required}
              label={label}
              multiple={false}
              selectable={typeof selectable !== 'undefined' ? selectable : true}
              list={list}
              selected={selected}
              onIconClick={this.onIconClick}
              setSelected={this.setSelected}
          />
      );
  }
}
