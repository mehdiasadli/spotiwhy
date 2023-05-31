'use client'

import useSubscribeModal from '@/hooks/useSubscribeModal'
import { useUser } from '@/hooks/useUser'
import { postData } from '@/libs/helpers'
import { getStripe } from '@/libs/stripeClient'
import { Price, ProductWithPrice } from '@/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Button from './Button'
import Modal from './Modal'

interface SubscribeModalProps {
  products: ProductWithPrice[]
}

const formatPrice = (price: Price) => {
  const priceStr = new Intl.NumberFormat('en-Us', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0
  }).format((price?.unit_amount || 0) / 100)

  return priceStr
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal()
  const { user, isLoading, subscription } = useUser()
  const [priceIdLoading, setPriceIdLoading] = useState<string>()

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose()
    }
  }

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)

    if (!user) {
      setPriceIdLoading(undefined)
      return toast.error('Must be logged in')
    }

    if (subscription) {
      setPriceIdLoading(undefined)
      return toast('Alraedy subscribed')
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      })

      const stripe = await getStripe()
      stripe?.redirectToCheckout({ sessionId })
    } catch (err) {
      toast.error((err as Error)?.message)
    } finally {
      setPriceIdLoading(undefined)
    }
  }

  let content = <div className='text-center'>No products available</div>

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>
          }

          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className='mb-4'
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button>
          ))
        })}
      </div>
    )
  }

  if (subscription) {
    content = <div className='text-center'>Already subscribed</div>
  }

  return (
    <Modal
      title='Only for premium users'
      desc='Listen to music with Spotiwhy Premium'
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  )
}

export default SubscribeModal
