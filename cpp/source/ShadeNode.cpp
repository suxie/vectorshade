#include "ShadeNode.h"

ShadeNode::ShadeNode(int type, ShadeNode* left, ShadeNode* right):
  type(type), left(left), right(right) {}

ShadeNode::~ShadeNode()
{
}

bool ShadeNode::hasChildren() {
  return (this->left != nullptr || this->right != nullptr);
}