#pragma once
class ShadeNode
{
public:
  ShadeNode(int type, ShadeNode* left, ShadeNode* right);
  ~ShadeNode();

  int type;
  ShadeNode* left;
  ShadeNode* right;
  ShadeNode* parent;

};

