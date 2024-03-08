figma.showUI(__html__);

/** Finds nodes within the selection that contain the `clusterString` text. */
figma.ui.onmessage = (msg: { type: string; clusterString: string }) => {
  if (msg.type === "create-cluster") {
    const nodesToCluster: (ShapeWithTextNode | StickyNode)[] = [];

    figma.currentPage.selection.forEach((node) => {
      if (node.type === "STICKY" || node.type === "SHAPE_WITH_TEXT") {
        const nodeText = node.text.characters.toLowerCase();
        const clusterString = msg.clusterString.toLowerCase();

        if (nodeText.includes(clusterString)) nodesToCluster.push(node);
      }
    });

    figma.currentPage.selection = nodesToCluster;
  }

  figma.closePlugin();
};
