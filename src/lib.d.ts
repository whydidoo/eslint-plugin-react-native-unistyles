declare module 'eslint-plugin-react-native/lib/util/stylesheet' {
  import {
    CallExpression,
    JSXAttribute,
    ObjectExpression,
    Property,
    BaseNode,
    Literal,
    Expression,
  } from '@typescript-eslint/types/dist/generated/ast-spec';

  export interface ColorLiterals extends Literal {
    expression: Expression;
    node: Literal;
  }

  interface StyleSheetsInstance {
    styleSheets: StyleSheet;
    colorLiterals?: ColorLiterals[];
    objectExpressions?: ObjectExpression[];
    add(styleSheetName: string, properties: Styles): void;
    markAsUsed(fullyQualifiedName: string): void;
    getUnusedReferences(): StyleSheet;
    addColorLiterals(expressions: ColorLiterals[]): void;
    getColorLiterals(): ColorLiterals[];
    addObjectExpressions(expressions: ObjectExpression[]): void;
    getObjectExpressions(): ObjectExpression[];
  }

  export declare const astHelpers: {
    isStyleAttribute: (node: JSXAttribute) => boolean;
    collectColorLiterals: (
      node: BaseNode | null,
      context?: Readonly<RuleContext<'error', never[]>>
    ) => ColorLiterals[];
    getStyleDeclarations(node: CallExpression): Property[];
    getStyleDeclarationsChunks(node: CallExpression): any;
  };

  export const StyleSheets: {
    new (): StyleSheetsInstance;
  };
}
