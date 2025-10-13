import 'src/styles/app/reset.css'
import 'src/styles/app/fonts.css'
import 'src/styles/app/app.css'



const App = () => {
  
  
  return (
    <>
      <div>
        <div>App</div>
        
        <div
          style={{
            cursor: 'var(--cursor)',
            '--aa': 'aa',
            touchAction: 'none',
          }}
          css={{
            '--aa': 'aa',
            touchAction: 'none',
            cursor: 'var(--cursor)',
          }}
        >
          Test
        </div>
        
      </div>
    </>
  )
}
App.displayName = 'App'
export default App
