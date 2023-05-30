import { TbPlaylist } from 'react-icons/tb'
import { AiOutlinePlus } from 'react-icons/ai'

interface LibraryProps {}

const Library: React.FC<LibraryProps> = ({}) => {
  const onClick = () => {}

  return (
    <div className='flex flex-col '>
      <div className='flex items-center justify-between px-5 pt-4'>
        <div className='inline-flex items-center gap-x-2'>
          <TbPlaylist className='text-neutral-400' size={26} />
          <p className='text-neutral-400 font-medium text-md'>Your Library</p>
        </div>
        <AiOutlinePlus
          onClick={onClick}
          size={20}
          className='text-neutral-500 transition hover:text-white cursor-pointer'
        />
      </div>
      <div className='flex flex-col gap-y-2 px-3 mt-4'>List of Songs!</div>
    </div>
  )
}

export default Library
