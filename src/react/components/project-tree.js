import React from "react";
import R from "ramda";
import css from "./css";

class TreeNode extends React.Component {

  getStyle() {
    const listStyle = "none";
    const padding = "0 0 0 16px";
    const margin = "0";
    const cursor = "default";
    const userSelect = "none";
    const WebkitUserSelect = "none";
    const MozUserSelect = "none";
    const msUserSelect = "none";
    return {
      listStyle,
      padding,
      margin,
      cursor,
      userSelect,
      MozUserSelect,
      WebkitUserSelect,
      msUserSelect
    };
  }

  getTextStyle() {
    const style = {
      height: "20px",
      padding: "4px 0 0 0",
      margin: "0"
    };

    if (this.isSelected()) {
      style.background = css.palette.lightBg;
    }

    return style;
  }

  isSelected() {
    return this.props.project.selected &&
      this.props.parents &&
      this.props.project.selected.some(
        s =>
          s.name === this.props.node.name &&
          R.equals(s.parents, this.props.parents)
      );
  }

  getKey(name, parents) {
    return `project-tree-${parents.concat(name).join("-")}`;
  }

  getIcon(node) {
    switch(node.type) {
      case "dir":
        return <i style={{ paddingRight: "4px" }} className="fa fa-folder"></i>;
      default:
        return <i style={{ paddingRight: "4px" }} className="fa fa-file-code-o"></i>;
    }
  }

  getExpandCollapseIcon(node) {
    switch(node.type) {
      case "dir":
        return node.collapsed ?
        <i style={{ paddingRight: "4px" }} className="fa fa-caret-right"></i> :
        <i style={{ paddingRight: "4px" }} className="fa fa-caret-down"></i>;
      default:
        return null;
    }
  }

  onClick(event) {
    if (!event.shiftKey) {
      this.props.selectProjectItem(this.props.node.name, this.props.parents, this.props.node.type, !event.ctrlKey);
    } else {
      this.props.selectMultipleProjectItems(this.props.node.name, this.props.parents, this.props.node.type);
    }

    if (!event.ctrlKey && !event.shiftKey) {
      switch (this.props.node.type) {
        case "file": {
          this.props.openFile(this.props.parents.concat(this.props.node.name).join("/"));
          break;
        }
        case "dir": {
          if (this.props.node.collapsed) {
            this.props.expandDir(this.props.node.name, this.props.parents, this.props.node.type);
          } else {
            this.props.collapseDir(this.props.node.name, this.props.parents, this.props.node.type);
          }
        }
      }
    }
    event.stopPropagation();
  }

  showContextMenu(event) {
    const self = this;

    /*
      If we're already on a selectedItem don't select a new one.
      Otherwise, discard current selection and select a new item.
    */
    const selected = this.props.project.selected || [];
    if (!selected.some(s => this.props.node.name === s.name && R.equals(this.props.parents, s.parents))) {
      this.props.selectProjectItem(this.props.node.name, this.props.parents, this.props.node.type);
    }

    const newFile = { title: "New File",  handler: () => self.props.newFile() };
    const newFolder = { title: "New Folder", handler: () => self.props.newDir() };
    const rename = { title: "Rename",  handler: () => self.props.renameDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const duplicate = { title: "Duplicate", handler: () => self.props.duplicateDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const deleteItem = { title: "Delete", handler: () => self.props.deleteDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const copyItem = { title: "Copy", handler: () => self.props.copyDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const pasteItem = { title: "Paste", handler: () => self.props.pasteDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const cutItem = { title: "Cut", handler: () => self.props.cutDirOrFile(self.props.node.name, self.props.parents, self.props.node.type) };
    const copyFilePath = { title: "Copy File Path",  handler: () => self.props.copyPath() };

    this.props.showContextMenu(
      [
        newFile, newFolder,
        {},
        rename, duplicate, deleteItem, copyItem, pasteItem, cutItem,
        {},
        copyFilePath
      ],
      { left: event.pageX, top: event.pageY },
      proj => { console.log(proj); return proj.selected.length <= 1}
    );

    this.props.showContextMenu(
      [
        deleteItem,
        copyItem,
        pasteItem,
        cutItem
      ],
      { left: event.pageX, top: event.pageY },
      proj => proj.selected.length > 1
    );

    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    const node = this.props.node;
    const name = node.name;
    const parents = this.props.parents || [];
    const key = this.getKey(name, parents);

    if (node.collapsed) {
      return (
        <li key={key} onClick={this.onClick.bind(this)} style={this.getStyle()}>
          <p style={this.getTextStyle()}>{this.getExpandCollapseIcon(node)}{this.getIcon(node)}{name}</p>
        </li>
      );
    } else {
      return (
        <li key={key} onContextMenu={this.showContextMenu.bind(this)}
          onClick={this.onClick.bind(this)} style={this.getStyle()}>

          <p style={this.getTextStyle()}>{this.getExpandCollapseIcon(node)}{this.getIcon(node)}{name}</p>
          { node.contents ?
            (
              <ul style={{ margin: 0, padding: 0 }}>
                {
                  node.contents.map( node => <TreeNode {...this.props} key={`${key}-${node.name}-tr`} parents={parents.concat(name)} node={node} /> )
                }
              </ul>
            ):
            []
          }

        </li>
      );
    }
  }
}

class ProjectTree extends React.Component {
  render() {
    return(
      <div style={{ fontSize: "13px", color: css.palette.fg }}>
        <ul style={{ margin: "4px 0 0 0", padding: "0" }}>
          <TreeNode {...this.props} node={this.props.project} />
        </ul>
      </div>
    );
  }
}

export default ProjectTree;
