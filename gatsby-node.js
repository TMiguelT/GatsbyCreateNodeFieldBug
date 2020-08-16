const assert = require("assert")

exports.sourceNodes = async ({ actions, getNode }) => {
  const { createNode } = actions

  await createNode({
    id: "abcd",
    firstField: "123",
    internal: {
      type: "MyNode",
      contentDigest: "abcd"
    }
  })

  // At this point, looking up the node in the database will return the value of "firstField"
  const fullNode = getNode("abcd");
  assert("firstField" in fullNode)
  assert(fullNode.firstField === "123")
}

exports.createPages = async ({ actions: { createNodeField }, graphql, getNode }) => {
  // This is a fairly typical query where we want certain fields but not others
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
  `)
  const node = result.data.allMyNode.nodes[0]

  createNodeField({
    node: node,
    name: "secondField",
    value: "456"
  })

  const fullNode = getNode(node.id)

  // But this time if we run the same assertion, it will fail
  assert("secondField" in fullNode.fields)
  assert("firstField" in fullNode)
  assert(fullNode.firstField === "123")
}