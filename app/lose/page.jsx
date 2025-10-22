import React from 'react'

export default function Lose() {
  return (
    <div className=' flex flex-col justify-center items-center min-h-screen'>
      <div className='flex flex-col gap-4 w-fit p-8 rounded-xl bg-zinc-200 border-8 border-gray-800 '>
        <div className='text-2xl text-gray-950 font-bold font-clash '>Alas!</div>
        <div className='text-2xl text-gray-950 font-bold font-clash '>You lose 😭!</div>
        <a href='/' className='text-center text-lg px-2 py-1 text-white  bg-blue-500 rounded-xl'>Try Again</a>
      </div>
    </div>
  )
}
