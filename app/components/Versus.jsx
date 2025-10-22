import React, { useEffect } from 'react'
import useIde from '../ide'
import useSocket from '../socket'
import { useSession } from 'next-auth/react'

export default function Versus() {
    const {  myqs, opqs, incmyqs, incopqs } = useIde()
    const myval = (Number(myqs) / 2) * 100
    console.log(myqs, opqs);
    const {data: session} = useSession();
    
    const {socket, opponentName, opponentImage } = useSocket()
    const opval = ((2 - Number(opqs)) / 2) * 100
 
      
    console.log(myqs, opqs);

  return (
    <div className='flex flex-row p-4 gap-3 w-full justify-between items-center'>
        <div className='flex flex-col gap-3 justify-center items-center'>
            <img src={session?.user.image} alt="pic" className='w-20 h-20 rounded-full' />
            <h1 className='text-xl text-white'>{socket?.id}</h1>

        </div>
        <div className='flex flex-col  w-full h-5 border-2 border-white rounded-xl'>
            <div className='h-full  bg-amber-300 rounded-xl'  style={{ width: `${myval}%` }}></div>
        </div>
        <div className='flex flex-col  w-full h-5 border-2 bg-red-500 border-white rounded-xl'>
            <div className='h-full  bg-black w-[${opval}%] rounded-xl relative' style={{ width: `${opval}%` }}>
              <div className={(opqs === 0 || opqs == 2) ?  '' : 'absolute top-0 right-[-5] w-4 h-[100%] bg-red-500 rounded-xl' }></div>
            </div>
            
        </div>
        <div className='flex flex-col gap-3 justify-center items-center'>
            <img src={opponentImage} alt="pic" className='w-20 h-20 rounded-full' />
            <h1 className='text-xl text-white'>{opponentName}</h1>
        </div>
        
    </div>
  )
}
