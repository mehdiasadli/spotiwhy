import useAuthModal from '@/hooks/useAuthModal'
import { Song } from '@/types'
import usePlayer from './usePlayer'
import useSubscribeModal from './useSubscribeModal'
import { useUser } from './useUser'

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer()
  const authModal = useAuthModal()
  const subscribeModal = useSubscribeModal()
  const { user, subscription } = useUser()

  const onPlay = (id: string) => {
    if (!user) {
      return authModal.onOpen()
    }

    if (!subscription) {
      return subscribeModal.onOpen()
    }

    player.setId(id)
    player.setIds(songs.map((item) => item.id))
  }

  return onPlay
}

export default useOnPlay
