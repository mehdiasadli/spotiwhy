'use client'

import useDebounce from '@/hooks/useDebounce'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import qs from 'query-string'
import Input from './Input'

interface SearchInputProps {}

const SearchInput: React.FC<SearchInputProps> = ({}) => {
  const router = useRouter()
  const [value, setValue] = useState<string>('')
  const debounceVal = useDebounce(value)

  useEffect(() => {
    const query = {
      title: debounceVal
    }

    const url = qs.stringifyUrl({
      url: '/search',
      query: query
    })

    router.push(url)
  }, [debounceVal, router])

  return (
    <Input
      placeholder='What do you want to listen to?'
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export default SearchInput
