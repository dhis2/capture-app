import React from 'react';
import { getInstance } from 'd2/lib/d2';
import Tree from './Tree';

export default class OrgUnitTree extends React.Component {
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
      try {
          const d2 = await getInstance();
          d2.models.organisationUnits
              .list({
                  level: 1,
                  paging: false,
                  fields: 'id,path,displayName,children::isNotEmpty',
              })
              .then((root) => {
                  const { value: selectedPath } = this.props;
                  const list = root.toArray();
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
              });
      } catch (e) {
          console.log('OrgUnitTree root fetch failed');
      }
  }

  fetchNode = async (path, opening = false) => {
      try {
          const id = path.substr(path.lastIndexOf('/') + 1);

          const d2 = await getInstance();
          d2.models.organisationUnits
              .list({
                  paging: false,
                  filter: `id:in:[${id}]`,
                  fields: ':all,displayName,path,children[id,displayName,path,children]',
              })
              .then((r) => {
                  const organisationUnits = r.toArray();
                  const units = organisationUnits[0].children.valuesContainerMap;

                  const items = [];
                  // todo this would need to be taked care of (report lgtm)
                  // eslint-disable-next-line no-restricted-syntax,no-unused-vars
                  for (const [k, v] of units.entries()) {
                      const { value: selectedPath } = this.props;
                      const children = v.children.valuesContainerMap.size > 0 ? [] : null;
                      let open = children !== null && selectedPath && selectedPath.startsWith(v.path);

                      if (open && opening && selectedPath.substr(v.path.length).indexOf('/') > -1) {
                          this.fetchNode(v.path, opening);
                      } else {
                          open = false;
                      }

                      items.push({
                          open,
                          children,
                          value: v.path,
                          label: v.displayName,
                      });
                  }
                  items.sort((a, b) => a.label.localeCompare(b.label));

                  const { list } = this.state;
                  this.setChildren(path, items, list);
                  this.setState({
                      list: [...list],
                  });
              });
      } catch (e) {
          console.log('OrgUnitTree fetchNode failed');
          console.log(e);
      }
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
