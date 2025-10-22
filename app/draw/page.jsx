import React from 'react'

export default function Draw() {
  return (
    <div className=' flex flex-col justify-center items-center min-h-screen bg-black'>
      <div className='flex flex-col gap-3 w-fit p-8 rounded-xl bg-zinc-200 border-8 border-gray-800 '>
        <div className='text-2xl text-gray-950 font-bold font-clash '>Game Drawn!</div>
        <a href='/' className='text-center text-lg px-2 py-1 text-white  bg-blue-500 rounded-xl'>Go Home</a>
      </div>
    </div>
  )
}
