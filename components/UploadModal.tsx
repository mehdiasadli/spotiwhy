'use client'
import uniqid from 'uniqid'
import useUploadModal from '@/hooks/useUploadModal'
import { useUser } from '@/hooks/useUser'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Button from './Button'
import Input from './Input'
import Modal from './Modal'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

interface UploadModalProps {}

const UploadModal: React.FC<UploadModalProps> = ({}) => {
  const [isLoading, setIsLoading] = useState(false)

  const { user } = useUser()
  const router = useRouter()
  const uploadModal = useUploadModal()
  const supabaseClient = useSupabaseClient()
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null
    }
  })

  const onChange = (open: boolean) => {
    if (!open) {
      reset()
      uploadModal.onClose()
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true)

      const imageFile = values.image?.[0]
      const songFile = values.song?.[0]

      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields')
        return
      }

      const id = uniqid()

      const { data: songData, error: songError } = await supabaseClient.storage
        .from('songs')
        .upload(`song-${values.title}-${id}`, songFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (songError) {
        setIsLoading(false)
        return toast.error('Failed to upload song')
      }

      const { data: imageData, error: imageError } = await supabaseClient.storage
        .from('images')
        .upload(`image-${values.title}-${id}`, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (imageError) {
        setIsLoading(false)
        return toast.error('Failed to upload image')
      }

      const { error: supaError } = await supabaseClient.from('songs').insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path
      })

      if (supaError) {
        setIsLoading(false)
        return toast.error(supaError.message || 'Upload failed. Try again.')
      }

      router.refresh()
      setIsLoading(false)
      toast.success('Song uploaded successfully')
      reset()
      uploadModal.onClose()
    } catch (error: any) {
      toast.error(error?.message || 'Something went wrong. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title='Add a song'
      desc='Upload an mp3 file'
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-y-4'>
        <Input
          id='title'
          disabled={isLoading}
          placeholder='Song title'
          {...register('title', { required: true })}
        />
        <Input
          id='author'
          disabled={isLoading}
          placeholder='Song author'
          {...register('author', { required: true })}
        />
        <div>
          <div className='pb-1'>Select a song file</div>
          <Input
            id='song'
            type='file'
            disabled={isLoading}
            accept='.mp3'
            className='cursor-pointer'
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className='pb-1'>Select an image file</div>
          <Input
            id='image'
            type='file'
            disabled={isLoading}
            accept='image/*'
            className='cursor-pointer'
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type='submit' className='mt-2'>
          Create
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal
