import { AST_NODE_TYPES } from '@typescript-eslint/types';
import {
  CallExpressionArgument,
  Node,
} from '@typescript-eslint/types/dist/generated/ast-spec';

export const isAstObjectByType = <
  T extends AST_NODE_TYPES | AST_NODE_TYPES[],
  N extends Extract<Node, { type: T extends AST_NODE_TYPES ? T : T[number] }>,
>(
    node: Node | null,
    type: T,
  ): node is N => Boolean(node && type.includes(node.type));

export const isAstFunction = (
  node: any,
): node is Exclude<
Extract<CallExpressionArgument, { body: any }>,
{ type: AST_NODE_TYPES.ClassExpression }
> => Boolean(node.body && node.type !== AST_NODE_TYPES.ClassExpression);
