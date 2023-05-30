'use client'

import { Toaster } from 'react-hot-toast'

interface ToasterProviderProps {}

const ToasterProvider: React.FC<ToasterProviderProps> = ({}) => {
  return (
    <Toaster
      toastOptions={{
        style: {
          background: '#333',
          color: 'white'
        }
      }}
    />
  )
}

export default ToasterProvider
