import React, { useEffect } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'

export default function Controls({nextques, prevques}) {
  return (
    <div className='flex flex-row gap-4 px-4 text-white text-lg justify-end items-center'>
        <div onClick={() => prevques()} className='bg-blue-500  px-1 py-1 rounded-full cursor-pointer border-2 border-zinc-900'><ChevronLeft /></div>
        <div onClick={() => nextques()} className='bg-blue-500  px-1 py-1 rounded-full cursor-pointer border-2 border-zinc-900'><ChevronRight /></div>
    </div>
  )
}
