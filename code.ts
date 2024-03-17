figma.showUI(__html__);

type ClusterNode = ShapeWithTextNode | StickyNode | GroupNode;

/** Finds nodes within the selection that contain the `clusterString` text. */
figma.ui.onmessage = (msg: { type: string; clusterString: string }) => {
  if (msg.type === "create-cluster") {
    const nodesToCluster: ClusterNode[] = [];

    addMatchingNodesToCluster(
      figma.currentPage.selection,
      nodesToCluster,
      msg.clusterString
    );

    createSectionAndAddNodes(nodesToCluster, msg.clusterString);
  }

  figma.closePlugin();
};

/** Creates a section node and adds all nodes in `clusterArray` to it in the appropriate position. */
function createSectionAndAddNodes(
  clusterArray: ClusterNode[],
  sectionTitle: string
) {
  const currentViewPort = figma.currentPage.selection[0].absoluteBoundingBox;
  if (currentViewPort && clusterArray.length > 0) {
    const section = figma.createSection();
    section.name = sectionTitle;
    const sectionWidth = clusterArray[0].width * 3 + 175; // Width of three nodes plus 175 to add padding
    const sectionHeight =
      clusterArray[0].height * Math.ceil(clusterArray.length / 3) + 175; // Height of node cluster plus 175 to add padding
    section.resizeWithoutConstraints(sectionWidth, sectionHeight);

    clusterArray.forEach((node, index) => {
      node.x = getNodeX(section.x, node, index);
      node.y = getNodeY(section.y, node, index);
      section.appendChild(node);
    });

    figma.currentPage.selection = [section]; // Select newly created section
    // Offset section from the current viewport to make the new cluster more visible
    section.x = currentViewPort.x + 150;
    section.y = currentViewPort.y + 150;
  }
}

/**
 * Checks each node in the selection to see if the node or any of its children contain
 * the cluster string and adds the node to the cluster array if so.
 */
function addMatchingNodesToCluster(
  selection: readonly SceneNode[],
  clusterArray: ClusterNode[],
  clusterString: string
) {
  selection.forEach((node) => {
    if (node.type === "GROUP") {
      node.children.forEach((childNode) => {
        if (nodeIncludesClusterText(childNode, clusterString)) {
          addNodeToCluster(node, clusterArray);
        }
      });
    } else {
      if (nodeIncludesClusterText(node, clusterString)) {
        addNodeToCluster(node, clusterArray);
      }
    }
  });
}

/**
 * Adds node to the cluster array if its type is valid.
 */
function addNodeToCluster(node: SceneNode, clusterArray: ClusterNode[]) {
  if (
    node.type === "STICKY" ||
    node.type === "SHAPE_WITH_TEXT" ||
    node.type === "GROUP"
  ) {
    clusterArray.push(node);
  }
}

/**
 * Returns true if the given node has a valid type and contains the cluster string.
 */
function nodeIncludesClusterText(node: SceneNode, clusterString: string) {
  if (node.type === "STICKY" || node.type === "SHAPE_WITH_TEXT") {
    const nodeText = node.text.characters.toLowerCase();

    if (nodeText.includes(clusterString.toLowerCase())) return true;

    return false;
  }
}

/**
 * Returns the x value for where the node should live in the cluster based on its index.
 */
function getNodeX(currentX: number, node: ClusterNode, index: number) {
  const nodeWidth = node.width + 25; // Add spacing between each node
  if (index > 2) {
    const indexMod = index % 3;
    return currentX + nodeWidth * indexMod;
  } else {
    return currentX + nodeWidth * index;
  }
}

/**
 * Returns the y value for where the node should live in the cluster based on its index.
 */
function getNodeY(currentY: number, node: ClusterNode, index: number) {
  const nodeHeight = node.height + 25; // Add spacing between each node
  if (index > 2) {
    const indexNum = (index + 1) / 3;
    return currentY + Math.ceil(indexNum - 1) * nodeHeight;
  } else {
    return currentY;
  }
}
