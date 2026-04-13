import _template from '@babel/template'
const template = _template.default || _template // Handles both ESM and CJS
import * as t from '@babel/types'

const exprAst = template.expression.ast



// This plugin adds 'cn' & 'st' props to jsx element.
// 'cn' & 'st' only available as a prop declaration, use of them in spread is not supported.

// Absence of 'cn' has no impact.
// Falsy value (e.g. when !!value === false) of 'cn' has no impact.
// Preserved last value of 'className' prop or 'className' in spread.
// Value of 'cn' prop is added before final 'className' value (including spread values).
// Final className value is added as last spread prop.
// Final className value is added as last spread prop and any 'cn' prop is removed.

// Absence of 'st' has no impact.
// Falsy value (e.g. when !!value === false) of 'st' has no impact.
// Empty object value (object without own enumerable props) of 'st' has no impact.
// Preserved last value of 'style' prop or 'style' in spread.
// Props of value of 'st' prop are added before final 'style' value props (including spread values).
// Final style value is added as last spread prop and any 'st' prop is removed.



export default function babelPluginJsxCnStProps() {
  return {
    name: 'babel-plugin-jsx-cn-st-prop',
    visitor: {
      JSXOpeningElement(path) {
        const attrs = path.get('attributes')
        
        let hasClassNameAttr
        let classNameAttrValue
        let hasCnAttr
        let cnAttrValue
        const classNameSpreads = []
        
        let hasStyleAttr
        let styleAttrValue
        let hasStAttr
        let stAttrValue
        const styleSpreads = []
        
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
              classNameSpreads.push(arg)
            }
            if (!hasStyleAttr) {
              const arg = attr.node.argument
              styleSpreads.push(arg)
            }
            
          }
        }
        
        
        
        // Calculate final value of className
        {
          const cnBox = (() => {
            // If cn attr does not exist, return empty container-object.
            if (!hasCnAttr) return exprAst`{ }`
            // If cn attr evaluates to falsy value (meaning cn attr does not exist)
            // then return empty container-object.
            // Otherwise, return container-object with attr & value.
            return exprAst`(() => {
              const cn = ${cnAttrValue}
              if (!cn) return { }
              return { className: cn }
            })()`
          })()
          
          const classNameBox = (() => {
            // If className attr does not exist, return empty container-object.
            if (!hasClassNameAttr) return exprAst`{ }`
            // Otherwise, return container-object with attr & value.
            return exprAst`{ className: ${classNameAttrValue} }`
          })()
          
          // Find spread with className prop in it and return it in container-object.
          // Otherwise, return classNameBox.
          const classNameSpreadAndAttrBox = exprAst`(() => {
            const classNameSpread = ${t.arrayExpression(classNameSpreads)}
              .find(it => 'className' in it)
            if (!classNameSpread) return ${classNameBox}
            return { className: classNameSpread.className }
          })()`
          
          // If cn-container is empty then return empty container-object
          // so nothing changes.
          // Else if there was no className prop in spread
          // then return cn container-object.
          // Else combine values (cn first) and return in container-object
          const finalClassNameBox = exprAst`(() => {
            const cnBox = ${cnBox}
            if (!('className' in cnBox)) return { }
            const className = ${classNameSpreadAndAttrBox}
            if (!('className' in className)) return cnBox
            return { className: [cnBox.className, className.className].join(' ') }
          })()`
          
          // Add container-object as spread
          path.node.attributes.push(
            t.jsxSpreadAttribute(finalClassNameBox)
          )
        }
        
        
        
        // Calculate final value of style
        {
          const stBox = (() => {
            // If st attr does not exist, return empty container-object.
            if (!hasStAttr) return exprAst`{ }`
            // If st attr evaluates to falsy value or empty object (meaning st attr does not exist)
            // then return empty container-object.
            // Otherwise, return container-object with attr & value.
            return exprAst`(() => {
              const st = ${stAttrValue}
              if (!st) return { }
              if (!Object.keys(st).length) return { }
              return { style: st }
            })()`
          })()
          
          const styleBox = (() => {
            // If style attr does not exist, return empty container-object.
            if (!hasStyleAttr) return exprAst`{ }`
            // Otherwise, return container-object with attr & value.
            return exprAst`{ style: ${styleAttrValue} }`
          })()
          
          // Find spread with style prop in it and return it in container-object.
          // Otherwise, return styleBox.
          const styleSpreadAndAttrBox = exprAst`(() => {
            const styleSpread = ${t.arrayExpression(styleSpreads)}
              .find(it => 'style' in it)
            if (!styleSpread) return ${styleBox}
            return { style: styleSpread.style }
          })()`
          
          // If st-container is empty then return empty container-object
          // so nothing changes.
          // Else if there was no style prop in spread
          // then return st container-object.
          // Else combine values (st first) and return in container-object
          const finalStyleBox = exprAst`(() => {
            const stBox = ${stBox}
            if (!('style' in stBox)) return { }
            const styleBox = ${styleSpreadAndAttrBox}
            if (!('style' in styleBox)) return stBox
            return { style: { ...stBox.style, ...styleBox.style } }
          })()`
          
          // Add container-object as spread
          path.node.attributes.push(
            t.jsxSpreadAttribute(finalStyleBox)
          )
        }
        
        
      },
    },
  }
}
