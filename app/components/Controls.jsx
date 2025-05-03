import React, { useEffect } from 'react'
import useSocket from '../socket'


export default function Controls({nextques, prevques}) {

  return (
    <div className='flex flex-row gap-4 text-white text-xl justify-center items-center'>
        <div onClick={() => nextques()} className='bg-blue-500  px-3 py-1 rounded-full cursor-pointer border-1 border-white'>Next</div>
        <div onClick={() => prevques()} className='bg-blue-500  px-3 py-1 rounded-full cursor-pointer border-1 border-white'>Prev</div>
    </div>
  )
}
