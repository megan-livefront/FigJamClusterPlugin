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

    const currentViewPort = figma.currentPage.selection[0].absoluteBoundingBox;
    if (currentViewPort) {
      nodesToCluster.forEach((node, index) => {
        const positiveIndex = index + 1;
        node.x = getNodeX(currentViewPort.x, node, positiveIndex);
        node.y = getNodeY(currentViewPort.y, node, positiveIndex);
      });

      figma.currentPage.selection = nodesToCluster;
    }
  }

  figma.closePlugin();
};

function getNodeX(
  currentX: number,
  node: ShapeWithTextNode | StickyNode,
  index: number
) {
  const nodeWidth = node.width + 25; // Add spacing between each node
  if (index > 3) {
    if (index % 3 === 0) {
      return currentX - nodeWidth * 3;
    } else {
      return currentX - nodeWidth * (index % 3);
    }
  } else {
    return currentX - nodeWidth * index;
  }
}

function getNodeY(
  currentY: number,
  node: ShapeWithTextNode | StickyNode,
  index: number
) {
  const nodeHeight = node.height + 25; // Add spacing between each node
  if (index > 3) {
    return currentY + Math.ceil(index / 3) * nodeHeight;
  } else {
    return currentY + nodeHeight;
  }
}
