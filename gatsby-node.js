const assert = require("assert");

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }) => {
  const { createNode } = actions

  await createNode({
    id: "abcd",
    firstField: "123",
    internal: {
      type: "MyNode",
      contentDigest: "abcd"
    }
  });
}

exports.createPages = async ({ actions: {createNodeField}, graphql ,     getNode }) => {
  const result = await graphql(`
    {
      allMyNode {
        nodes {
          id
          internal {
            fieldOwners
          }
        }
      }
    }
  `);
  
  const node = result.data.allMyNode.nodes[0];
  
  createNodeField({
    node: node,
    name: "secondField",
    value: "456"
  });

  const fullNode = getNode(node.id);


  assert('secondField' in fullNode.fields);
  assert('firstField' in fullNode);
  assert(fullNode.firstField === '123');
};