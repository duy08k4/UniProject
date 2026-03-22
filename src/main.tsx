import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./style/main.css"
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position='top-right' theme='light' closeButton duration={4000} richColors visibleToasts={10}  />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
