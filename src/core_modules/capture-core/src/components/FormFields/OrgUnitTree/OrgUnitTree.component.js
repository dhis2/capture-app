import React from 'react';
import { getInstance } from 'd2/lib/d2';
import Tree from './Tree';

export default class OrgUnitTree extends React.Component {
  state = {
      list: [],
      selected: this.props.selected || [],
  }

  async componentWillMount() {
      await this.fetchRoot();
  }

  componentWillReceiveProps({ selected }) {
      this.setState({ selected });
  }

  setSelected = (selected) => {
      this.setState({ selected });
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
                  const list = root.toArray();
                  this.setState({
                      list: list.map((item) => {
                          const { path, displayName } = item;
                          return {
                              open: false,
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

  fetchNode = async (path) => {
      try {
          const id = path.substr(path.lastIndexOf('/') + 1);

          const d2 = await getInstance();
          d2.models.organisationUnits
              .list({
                  paging: false,
                  filter: `id:in:[${id}]`,
                  fields: ':all,displayName,path,children[id,displayName,path,children::isNotEmpty]',
              })
              .then((r) => {
                  const organisationUnits = r.toArray();
                  const children = organisationUnits[0].children.valuesContainerMap;

                  const items = [];
                  for (const [k, v] of children.entries()) {
                    items.push({
                      open: false,
                      value: v.path,
                      label: v.displayName,
                      children: [],
                    });
                  }
                  items.sort((a, b) => a.label.localeCompare(b.label));

                  console.log('items')
                  console.log(items)

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
      const { multiple, selectable } = this.props;
      const { list, selected } = this.state;
      return (
          <Tree
              multiple={typeof multiple !== 'undefined' ? multiple : false}
              selectable={typeof selectable !== 'undefined' ? selectable : true}
              list={list}
              selected={selected}
              onIconClick={this.onIconClick}
              setSelected={this.setSelected}
          />
      );
  }
}
