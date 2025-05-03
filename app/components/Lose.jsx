import React from 'react'

export default function Lose() {
  return (
    <div className='absolute flex flex-col justify-center items-center gap-3 w-[30%] top-[50%] h-[50%] left-[35%] rounded-xl bg-zinc-200 border-8 border-gray-800 backdrop-filter backdrop-blur-xl'>
        <div className='text-2xl text-gray-950 font-bold font-clash '>Alas!</div>
        <div className='text-2xl text-gray-950 font-bold font-clash '>You lose 😭!</div>
        <div className='text-lg px-2 py-1 text-white  bg-blue-500 rounded-xl'>Try Again</div>
    </div>
  )
}
