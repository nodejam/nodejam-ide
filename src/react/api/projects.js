/* @flow */
import sampleProj from "../../data/sample-proj.json";

export async function getProject(url) {
  return sampleProj;
}

const example = `import React from "react";
import css from "./css";

class MenuItem extends React.Component {
  render() {
    return(
      <li style={{ width: "56px", float: "left", color: css.palette.fg }}>{this.props.title}</li>
    );
  }
}

class MainMenu extends React.Component {
  render() {
    return(
      <ul style={{ fontSize: css.fontSize.medium, paddingTop: "8px", background: css.palette.lightBg, height: "24px", margin: 0 }}>
        <MenuItem title="File" />
        <MenuItem title="Edit" />
        <MenuItem title="Find" />
        <MenuItem title="View" />
        <MenuItem title="Run" />
        <MenuItem title="Tools" />
        <MenuItem title="Deploy" />
      </ul>
    );
  }
}

export default MainMenu;
`;

export async function getFiles(files, project) {
  return [
    {
      name: files[0],
      contents: `/*${Date.now()}*/` + "\r\n" + example
    }
  ];
}
