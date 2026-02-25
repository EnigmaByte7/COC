"use client"
import React from 'react'
import { signIn, signOut,  } from 'next-auth/react';

export default  function Navbar({session}) {
    //console.log(session)
  return (
    <div className='flex w-full p-4 flex-row gap-6 items-center text-xl justify-end text-white fixed'>
    {
        session ? (
          <>
            <img src={session.user.image} className='rounded-full' width={50} height={50} referrerPolicy="no-referrer"></img>
            <button className='h-10 bg-blue-600 rounded-full px-4 py-2 cursor-pointer border-1 border-white z-100' onClick={() => signOut()}>Sign Out</button>
          </>
        )
        :
        (
          <button className='h-10 bg-blue-600 rounded-full px-2 py-1 cursor-pointer border-1 border-white z-100' onClick={() => signIn('google')}>Sign In</button>
        )
    }
    </div>
  )
}
