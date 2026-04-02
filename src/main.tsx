import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import "./style/main.css"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { PrimeReactProvider } from 'primereact/api';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <PrimeReactProvider>
          <App />
        </PrimeReactProvider>
        <Toaster position='top-right' theme='light' closeButton duration={4000} richColors visibleToasts={10} offset={{ bottom: 50 }} />
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
