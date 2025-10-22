"use client"
import React, { use, useEffect } from 'react'
import useSocket from '../socket'
import p1 from '../assets/p1.jpg'
import p2 from '../assets/p2.jpg'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function VS_Page() {
    const {opponentName, mid, opponentImage} = useSocket();
    const {data:session} = useSession();
    console.log(opponentName);
    const router = useRouter();
    
    useEffect(() => {
      setTimeout(() => { 
        router.push(`/match/${mid}`)
      }, 4000)
     }, [session, opponentName])

  return (
        <div className='flex justify-between items-center flex-row w-full min-h-screen px-5'>
          <div className='flex justify-center items-center flex-col gap-5'>    
            <Image src={session?.user.image} width={100} height={100} alt='searching' />
           <h3 className='font-clash text-3xl'>{session?.user.name}</h3> 
          </div>
          
          <div className='flex justify-center items-center flex-col gap-5'>    
           <h3 className='font-clash text-3xl font-extrabold'>VS</h3> 
          </div>

          <div className='flex justify-center items-center flex-col gap-5'>    
            <Image src={opponentImage} width={100} height={100} alt='searching' />
           <h3 className='font-clash text-3xl'>{opponentName}</h3> 
          </div>
        </div>
  )
}
