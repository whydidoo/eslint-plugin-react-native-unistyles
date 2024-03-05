import { ESLintUtils } from '@typescript-eslint/utils';
import {
  StyleSheets,
  ColorLiterals,
  astHelpers,
} from 'eslint-plugin-react-native/lib/util/stylesheet';
import util from 'util';

import {
  AST_NODE_TYPES,
  CallExpression,
  Node,
  ReturnStatement,
  Property,
} from '@typescript-eslint/types/dist/generated/ast-spec';
import { AstHelpers } from '../../utils/AstHelper';
import { isAstObjectByType } from '../../utils/definitons';

const creator = ESLintUtils.RuleCreator(() => 'https://github.com/whydidoo');

export const noColorLiterals = creator({
  create(context) {
    const unistyleAstHelper = new AstHelpers(context);
    const styleSheets = new StyleSheets();

    function reportColorLiterals(colorLiterals: ColorLiterals[]) {
      if (colorLiterals) {
        colorLiterals.forEach((style) => {
          if (style) {
            const expression = util.inspect(style.expression);
            context.report({
              node: style.node,
              data: { expression },
              messageId: 'error',
            });
          }
        });
      }
    }

    const getNode = (node: Node) => {
      if (!unistyleAstHelper.isDeclarated) {
        return;
      }

      if (isAstObjectByType(node, AST_NODE_TYPES.ReturnStatement)) {
        const color = astHelpers.collectColorLiterals(
          (node as ReturnStatement).argument,
          context,
        );
        styleSheets.addColorLiterals(color);
      } else if (isAstObjectByType(node, AST_NODE_TYPES.Property)) {
        const color = astHelpers.collectColorLiterals(
          (node as Property).value,
          context,
        );
        styleSheets.addColorLiterals(color);
      } else {
        const color = astHelpers.collectColorLiterals(node, context);
        styleSheets.addColorLiterals(color);
      }
    };

    const callExpression = 'CallExpression[callee.name="createStyleSheet"]';
    const stylePropObjectSelector = 'Property[value.type=/^(ObjectExpression|ConditionalExpression|LogicalExpression)$/]';
    const matchIsExpression = ':matches(ObjectExpression, ConditionalExpression, LogicalExpression)';
    const typeFunctions = '[type=/^(ArrowFunctionExpression|FunctionExpression)$/]';
    const selectorFN = `${typeFunctions} :statement ReturnStatement`;

    return {
      ImportDeclaration: unistyleAstHelper.isContainedFunctionsStyle,
      [callExpression]: (node: CallExpression) => {
        unistyleAstHelper.setStyleDeclaration(node);

        if (unistyleAstHelper.isDeclarated) {
          astHelpers.getStyleDeclarations(node).forEach(getNode);
        }
      },
      [`${callExpression} > ${selectorFN} ${matchIsExpression} ${stylePropObjectSelector}`]:
        getNode,
      [`${callExpression} > ${selectorFN} ${selectorFN}`]: getNode,
      [`${callExpression} > ${typeFunctions} > ${matchIsExpression} ${stylePropObjectSelector}`]:
        getNode,
      'Program:exit': () => reportColorLiterals(styleSheets.getColorLiterals()),
    };
  },
  name: 'no-color-literals',
  meta: {
    messages: {
      error: 'Color literal: {{expression}}',
    },
    type: 'problem',
    schema: [],
    docs: {
      description: 'not use color literal',
      recommended: 'error',
    },
  },
  defaultOptions: [],
});
