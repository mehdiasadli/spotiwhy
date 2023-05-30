import useAuthModal from '@/hooks/useAuthModal'
import { Song } from '@/types'
import usePlayer from './usePlayer'
import { useUser } from './useUser'

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer()
  const authModal = useAuthModal()
  const { user } = useUser()

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen()
    }

    player.setId(id)
    player.setIds(songs.map((item) => item.id))
  }

  return onPlay
}

export default useOnPlay