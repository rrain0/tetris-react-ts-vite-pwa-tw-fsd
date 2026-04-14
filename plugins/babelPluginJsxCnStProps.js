import _template from '@babel/template'
const template = _template.default || _template // Handles both ESM and CJS
const exprAst = template.expression.ast
import * as t from '@babel/types'



// This plugin adds 'cn' & 'st' props (and spread) to jsx element.

// 'cn' & 'st' always has lower precedence to 'className' & 'style'
// as they are meant for local styles.

// Any 'cn' & 'st' are removed from jsx (but original object in spread is not touched).
// and is merged with 'className' & 'style'.
// Any 'style' & 'className' are preserved as is.
// If jsx node has no 'cn' attr and no 'st' attr and no spreads then this plugin does nothing.
// Otherwise, plugin adds one or two spreads as last attr
// to calculate values of 'className' & 'style' in runtime.

// Absence of 'cn' has no impact on merged prop.
// Falsy value (e.g. when !!value === false) of 'cn' has no impact on merged prop.
// Preserved last value of 'className' prop or 'className' in spread.
// Value of 'cn' prop is added before final 'className' value (including spread values).
// Final className value is added as last spread prop.
// Final className value is added as last spread prop and any 'cn' prop is removed.

// Absence of 'st' has no impact on merged prop.
// Falsy value (e.g. when !!value === false) of 'st' has no impact on merged prop.
// Empty object value (object without own enumerable props) of 'st' has no impact on merged prop.
// Preserved last value of 'style' prop or 'style' in spread.
// Props of value of 'st' prop are added before final 'style' value props (including spread values).
// Final style value is added as last spread prop and any 'st' prop is removed.



export default function babelPluginJsxCnStProps() {
  return {
    name: 'babel-plugin-jsx-cn-st-prop',
    visitor: {
      JSXOpeningElement(path) {
        
        // Collect existing attrs
        
        const attrs = path.get('attributes')
        
        let hasCnAttr
        let cnAttrValue
        const cnSpreads = []
        
        let hasStAttr
        let stAttrValue
        const stSpreads = []
        
        let hasClassNameAttr // has any className attr
        let classNameAttrValue // value of last className attr
        const classNameSpreads = [] // from last spread attr arg to first before last className attr
        
        let hasStyleAttr
        let styleAttrValue
        const styleSpreads = []
        
        for (let i = attrs.length - 1; i >= 0; i--) {
          const attr = attrs[i]
          if (attr.isJSXAttribute()) {
            const name = attr.node.name.name
            
            let v = attr.node.value
            if (t.isJSXExpressionContainer(v)) v = v.expression
            
            if (name === 'cn') {
              if (!hasCnAttr) {
                hasCnAttr = true
                cnAttrValue = v
              }
              attr.remove()
            }
            else if (name === 'st') {
              if (!hasStAttr) {
                hasStAttr = true
                stAttrValue = v
              }
              attr.remove()
            }
            else if (name === 'className') {
              if (!hasClassNameAttr) {
                hasClassNameAttr = true
                classNameAttrValue = v
              }
            }
            else if (name === 'style') {
              if (!hasStyleAttr) {
                hasStyleAttr = true
                styleAttrValue = v
              }
            }
            
          }
          else if (attr.isJSXSpreadAttribute()) {
            const arg = attr.node.argument
            
            if (!hasCnAttr) cnSpreads.push(arg)
            if (!hasStAttr) stSpreads.push(arg)
            if (!hasClassNameAttr) classNameSpreads.push(arg)
            if (!hasStyleAttr) styleSpreads.push(arg)
            
            // Remove 'cn' & 'st' from spread
            attr.node.argument = exprAst`(({ cn, st, ...spread }) => spread)(${arg})`
            
          }
        }
        
        
        
        const maybeCnSpread = !!cnSpreads.length
        const maybeStSpread = !!stSpreads.length
        
        const maybeCn = hasCnAttr || maybeCnSpread
        const maybeSt = hasStAttr || maybeStSpread
        
        // Calculate className final value
        if (maybeCn) {
          // If cn attr evaluates to truly value then return container-object with attr & value.
          // Otherwise, return empty container-object.
          // If cn attr does not exist, return empty container-object.
          const cnBox = hasCnAttr
            ? exprAst`((cn) => cn ? { className: cn } : { })(${cnAttrValue})`
            : exprAst`{ }`
          
          // Find spread with non-falsy value of cn prop in it and return it in container-object.
          // Otherwise, return cnBox.
          const cnSpreadAndPropBox = exprAst`((cnSpread, cnBox) => {
            cnSpread = cnSpread.find(it => !!it.cn)
            return cnSpread ? { className: cnSpread.cn } : cnBox
          })(${t.arrayExpression(cnSpreads)}, ${cnBox})`
          
          const classNameBox = (() => {
            // If className attr does not exist, return empty container-object.
            if (!hasClassNameAttr) return exprAst`{ }`
            // Otherwise, return container-object with attr & value.
            return exprAst`{ className: ${classNameAttrValue} }`
          })()
          
          // Find spread with className prop in it and return it in container-object.
          // Otherwise, return classNameBox.
          const classNameSpreadAndPropBox = exprAst`((classNameSpread, classNameBox) => {
            classNameSpread = classNameSpread.find(it => 'className' in it)
            return classNameSpread ? { className: classNameSpread.className } : classNameBox
          })(${t.arrayExpression(classNameSpreads)}, ${classNameBox})`
          
          // If cn-container is empty then return empty container-object
          // so nothing changes.
          // Else if there was no className prop in spread
          // then return cn container-object.
          // Else combine values (cn first) and return in container-object
          const finalClassNameBox = exprAst`((cnBox, classNameBox) =>
            !('className' in cnBox) ? { }
            : !('className' in classNameBox) ? cnBox
            : { className: [cnBox.className, classNameBox.className].join(' ') }
          )(${cnSpreadAndPropBox}, ${classNameSpreadAndPropBox})`
          
          // Add container-object as spread
          path.node.attributes.push(
            t.jsxSpreadAttribute(finalClassNameBox)
          )
        }
        
        // Calculate style final value
        if (maybeSt) {
          // If st attr evaluates to truly value with any own enumerable keys
          // then return container-object with attr & value.
          // Otherwise, return empty container-object.
          // If st attr does not exist, return empty container-object.
          const stBox = hasStAttr
            ? exprAst`((st) => st && Object.keys(st).length ? { style: st } : { })(${stAttrValue})`
            : exprAst`{ }`
          
          // Find spread with non-falsy st prop in it and return it in container-object.
          // Otherwise, return stBox.
          const stSpreadAndPropBox = exprAst`((stSpread, stBox) => {
            stSpread = stSpread.find(it => !!it.st)
            return stSpread ? { style: stSpread.st } : stBox
          })(${t.arrayExpression(stSpreads)}, ${stBox})`
          
          const styleBox = (() => {
            // If style attr does not exist, return empty container-object.
            if (!hasStyleAttr) return exprAst`{ }`
            // Otherwise, return container-object with attr & value.
            return exprAst`{ style: ${styleAttrValue} }`
          })()
          
          // Find spread with style prop in it and return it in container-object.
          // Otherwise, return styleBox.
          const styleSpreadAndPropBox = exprAst`((styleSpread, styleBox) => {
            styleSpread = styleSpread.find(it => 'style' in it)
            return styleSpread ? { style: styleSpread.style } : styleBox
          })(${t.arrayExpression(styleSpreads)}, ${styleBox})`
          
          // If st-container is empty then return empty container-object
          // so nothing changes.
          // Else if there was no style prop in spread
          // then return st container-object.
          // Else combine values (st first) and return in container-object
          const finalStyleBox = exprAst`((stBox, styleBox) =>
            !('style' in stBox) ? { }
            : !('style' in styleBox) ? stBox
            : { style: { ...stBox.style, ...styleBox.style } }
          )(${stSpreadAndPropBox}, ${styleSpreadAndPropBox})`
          
          // Add container-object as spread
          path.node.attributes.push(
            t.jsxSpreadAttribute(finalStyleBox)
          )
        }
        
        
      },
    },
  }
}
