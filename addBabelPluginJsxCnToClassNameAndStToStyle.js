import _template from '@babel/template'
const template = _template.default || _template // Handles both ESM and CJS
import * as t from '@babel/types'



export default function addBabelPluginJsxCnToClassNameAndStToStyle() {
  return {
    name: 'babel-plugin-jsx-cn-to-classname-and-st-to-style',
    visitor: {
      JSXOpeningElement(path) {
        const attrs = path.get('attributes')
        
        let hasClassNameAttr
        let classNameAttrValue
        let hasCnAttr
        let cnAttrValue
        
        let hasStyleAttr
        let styleAttrValue
        let hasStAttr
        let stAttrValue
        
        const spreadAttrArgs = []
        
        for (let i = attrs.length - 1; i >= 0; i--) {
          const attr = attrs[i]
          if (attr.isJSXAttribute()) {
            const name = attr.node.name.name
            let v = attr.node.value
            if (t.isJSXExpressionContainer(v)) v = v.expression
            if (name === 'className') {
              if (!hasClassNameAttr) {
                hasClassNameAttr = true
                classNameAttrValue = v
              }
            }
            else if (name === 'cn') {
              if (!hasCnAttr) {
                hasCnAttr = true
                cnAttrValue = v
              }
              attr.remove()
            }
            else if (name === 'style') {
              if (!hasStyleAttr) {
                hasStyleAttr = true
                styleAttrValue = v
              }
            }
            else if (name === 'st') {
              if (!hasStAttr) {
                hasStAttr = true
                stAttrValue = v
              }
              attr.remove()
            }
          }
          else if (attr.isJSXSpreadAttribute()) {
            if (!hasClassNameAttr) {
              const arg = attr.node.argument
              spreadAttrArgs.push(arg)
            }
          }
        }
        
        
        if (hasCnAttr) {
          const spread = t.arrayExpression(spreadAttrArgs)
          const className = classNameAttrValue === undefined
            ? t.identifier('undefined')
            : classNameAttrValue
          const finalClassNameAttrValue = template.expression.ast`
            [
              ${cnAttrValue},
              ${spread}.find(it => 'className' in it)?.className ?? ${className},
            ].filter(it => it !== undefined).join(' ')
          `
          
          path.node.attributes.push(t.jsxAttribute(
            t.jsxIdentifier('className'),
            t.jsxExpressionContainer(finalClassNameAttrValue),
          ))
        }
        if (hasStAttr) {
          const st = stAttrValue === undefined
            ? t.identifier('undefined')
            : stAttrValue
          const spread = t.arrayExpression(spreadAttrArgs)
          const style = styleAttrValue === undefined
            ? t.identifier('undefined')
            : t.objectExpression(styleAttrValue)
          const finalStyleAttrValue = template.expression.ast`
            {
              ...${st},
              ...${spread}.find(it => 'style' in it)?.style ?? ${style}
            }
          `
          
          path.node.attributes.push(t.jsxAttribute(
            t.jsxIdentifier('style'),
            t.jsxExpressionContainer(finalStyleAttrValue),
          ))
        }
      },
    },
  }
}
