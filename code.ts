// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many shapes and connectors on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; clusterString: string }) => {
  if (msg.type === "create-cluster") {
    const notesToCluster: ShapeWithTextNode[] = [];

    figma.currentPage.selection.forEach((note) => {
      if (
        note.type === "SHAPE_WITH_TEXT" &&
        note.text.characters.includes(msg.clusterString)
      ) {
        notesToCluster.push(note);
        figma.currentPage.appendChild(note);
      }
    });

    console.log("NOTES TO CLUSTER", notesToCluster);
    figma.currentPage.selection = notesToCluster;
  }

  figma.closePlugin();
};
