import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './layouts/global.css'
import { RouterProvider } from './providers/Router.provider.tsx'

import { StoreContext, store } from 'shared/store/store';

document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider />
    </StoreContext.Provider>
  </StrictMode>,    
)
