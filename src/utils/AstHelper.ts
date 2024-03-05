import { AST_NODE_TYPES } from '@typescript-eslint/types';
import {
  CallExpression,
  ImportDeclaration,
  ObjectExpression,
  Property,
  Node,
} from '@typescript-eslint/types/dist/generated/ast-spec';
import { RuleContext } from '@typescript-eslint/utils/dist/ts-eslint/Rule';
import { SourceCode } from '@typescript-eslint/utils/dist/ts-eslint';
import { isAstFunction, isAstObjectByType } from './definitons';

export class AstHelpers {
  hasImportLib = false;

  context: Readonly<RuleContext<'error', never[]>>;

  isDeclarated = false;

  constructor(context: Readonly<RuleContext<'error', never[]>>) {
    this.context = context;
  }

  getSourceCode: SourceCode['getText'] = (node) => this.context.getSourceCode().getText(node);

  isContainedFunctionsStyle = (node: ImportDeclaration) => {
    this.hasImportLib = node.source.value.includes('react-native-unistyles');
  };

  private containsCall = (node: CallExpression) => {
    const { callee } = node;

    return (
      callee.type === AST_NODE_TYPES.Identifier
      && callee.name === 'createStyleSheet'
    );
  };

  setStyleDeclaration = (node: CallExpression) => {
    this.isDeclarated = this.containsCall(node) && this.hasImportLib;

    return this.isDeclarated;
  };

  private getStyleObjectExpressionFromNode = (node: Node | null) => {
    let leftStyleObjectExpression: Property[] = [];
    let rightStyleObjectExpression: Property[] = [];

    if (!node) {
      return [];
    }

    if (isAstObjectByType(node, AST_NODE_TYPES.ObjectExpression)) {
      return this.getPropertiesFromNode(node);
    }

    switch (node.type) {
      case AST_NODE_TYPES.LogicalExpression:
        leftStyleObjectExpression = this.getStyleObjectExpressionFromNode(
          node.left,
        );
        rightStyleObjectExpression = this.getStyleObjectExpressionFromNode(
          node.right,
        );
        return ([] as Property[])
          .concat(leftStyleObjectExpression)
          .concat(rightStyleObjectExpression);
      case AST_NODE_TYPES.ConditionalExpression:
        leftStyleObjectExpression = this.getStyleObjectExpressionFromNode(
          node.consequent,
        );
        rightStyleObjectExpression = this.getStyleObjectExpressionFromNode(
          node.alternate,
        );
        return ([] as Property[])
          .concat(leftStyleObjectExpression)
          .concat(rightStyleObjectExpression);
      default:
        return [];
    }
  };

  private getPropertiesFromNode = (node: Node): Property[] => {
    const properties: Property[] = [];

    if (!node) {
      return [];
    }

    const getProperties = (node: ObjectExpression) => {
      const objects = node.properties.filter(
        (property) => property.type === AST_NODE_TYPES.Property
          && property.value.type === AST_NODE_TYPES.ObjectExpression,
      ) as Property[];

      properties.concat(objects);

      node.properties
        .filter(
          (property) => property.type === AST_NODE_TYPES.Property
            && property.value.type !== AST_NODE_TYPES.ObjectExpression,
        )
        .forEach((item) => {
          properties.concat(this.getPropertiesFromNode(item));
        });

      return properties;
    };

    if (
      isAstObjectByType(node, [
        AST_NODE_TYPES.LogicalExpression,
        AST_NODE_TYPES.ConditionalExpression,
      ])
    ) {
      properties.concat(this.getStyleObjectExpressionFromNode(node));
    }

    if (node.type === AST_NODE_TYPES.ObjectExpression) {
      properties.concat(getProperties(node));
    }

    if (isAstFunction(node)) {
      const { body } = node;

      if (isAstObjectByType(body, AST_NODE_TYPES.BlockStatement)) {
        // eslint-disable-next-line no-console
        console.log(body);
      } else {
        properties.concat(this.getPropertiesFromNode(node));
      }
    }

    return properties;
  };

  getStyleDeclarations = (node: CallExpression) => {
    const argument = node.arguments[0];

    return this.getPropertiesFromNode(argument);
  };
}
