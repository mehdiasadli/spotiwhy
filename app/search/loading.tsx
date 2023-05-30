'use client'

import Box from '@/components/Box'
import { PulseLoader } from 'react-spinners'

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = ({}) => {
  return (
    <Box className='h-full flex items-center justify-center'>
      <PulseLoader color='#22c55e' size={30} />
    </Box>
  )
}

export default Loading
