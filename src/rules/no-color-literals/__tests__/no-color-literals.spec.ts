import { ESLintUtils } from '@typescript-eslint/utils';
import { noColorLiterals } from '../index';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run(
  'no-trans-without-prettier-ignore inside Element',
  noColorLiterals,
  {
    valid: [
      {
        filename: 'valid_call_fn_without_fn_1.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'
        const styles = createStyleSheet(theme => {
          return ({
            style1: {
                color: theme.color.red,
            },
            style2: {
                color: theme.color.blue,
            },
          })
        });
      `,
      },
      {
        filename: 'valid_call_fn_with_fn_block_2.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'

        const styles = createStyleSheet((theme) => {
          return {
            style1: {
              color: theme.color.red,
            },
            style2: () => {
              return {
                clolor1: theme.color.blue,
              };
            },
            style3: () => {
              if (3) {
                if (2) {
                  return { color4: $color };
                }
                return { color2: blue };
              }
              return {
                clolor3: theme.color.blue,
              };
            },
          };
        });
      `,
      },
      {
        filename: 'valid_just_object_3.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'

        const styles = createStyleSheet({
          style1: {
            color: theme.color.red,
          },
          style2: {
            bgColor: blue,
          },
        });
      `,
      },
      {
        filename: 'valid_just_arr_fn_4.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'

        const styles = createStyleSheet((theme) => val || ({style: {color: red}}));
      `,
      },
    ],

    invalid: [
      {
        errors: [
          { messageId: 'error' },
          { messageId: 'error' },
          { messageId: 'error' },
        ],
        filename: 'invalid_call_fn_with_fn_1.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'

        const styles = createStyleSheet((theme) => {
          return {
            style1: {
              color: theme.color.red,
            },
            style2: () => {
              return {
                color: "red",
              };
            },
            style3: () => {
              if (con1) {
                if (cond2) {
                  return { color: "adar" };
                }

                return { color2: $blue };
              }

              return {
                color3: "blue",
              };
            },
          };
        });
      `,
      },
      {
        errors: [{ messageId: 'error' }],
        filename: 'invalid_call_fn_without_fn_2.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'
        const styles = createStyleSheet(theme => {
          return ({
            style1: {
              color: theme.color.red,
            },
            style2: {
              color: 'blue',
            },
          })
        });
      `,
      },
      {
        errors: [{ messageId: 'error' }, { messageId: 'error' }],
        filename: 'invalid_call_fn_without_fn_3.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'
        
        const styles = createStyleSheet({
          style1: {
            color: "red",
          },
          style2: {
            bgColor: blue,
          },
          style3: {
            borderColor: "blue",
          },
        });
      `,
      },
      {
        errors: [{ messageId: 'error' }, { messageId: 'error' }],
        filename: 'valid_just_arr_fn_4.tsx',
        code: `
        import { createStyleSheet } from 'react-native-unistyles'
        
        const styles = createStyleSheet((theme) =>
          val
            ? { style: { color: red, bgColor: "blue" } }
            : { style2: { color: "red" } },
        );
      `,
      },
    ],
  },
);
