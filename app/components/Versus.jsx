import React, { useEffect } from 'react'
import useIde from '../ide'
import { getinfo } from '../actions/firemethods'
import useSocket from '../socket'

export default function Versus() {
    const { oppic, pic,pname, opname, myqs, opqs, incmyqs, incopqs } = useIde()
    const myval = (myqs / 4) * 100
    console.log(myqs, opqs);
    
    const {socket, mid} = useSocket()
    const opval = (opqs / 4) * 100
    useEffect(() => {
        if (!socket) return;
      
        const handleReceive = (message) => {
          console.log('Received message:', message);
      
          if (message.comment === 'correct:my') {
            incmyqs();
          } else if (message.comment === 'correct:opp') {
            incopqs();
          }
        };
      
        socket.on('receive', handleReceive);
      
        return () => {
          socket.off('receive', handleReceive); 
        };
      }, [socket, incmyqs, incopqs]);
      

  return (
    <div className='flex flex-row p-4 gap-3 w-full justify-between items-center'>
        <div className='flex flex-col gap-3 justify-center items-center'>
            <img src={pic} alt="pic" className='w-20 h-20 rounded-full' />
            <h1 className='text-xl text-white'>{pname}</h1>
        </div>
        <div className='flex flex-col  w-full h-5 border-2 border-white rounded-xl'>
            <div className='h-full  bg-amber-300 rounded-xl'  style={{ width: `${myval}%` }}></div>
        </div>
        <div className='flex flex-col  w-full h-5 border-2 border-white rounded-xl'>
            <div className='h-full  bg-red-500 w-[${opval}%] rounded-xl' style={{ width: `${opval}%` }}></div>
        </div>
        <div className='flex flex-col gap-3 justify-center items-center'>
            <img src={oppic} alt="pic" className='w-20 h-20 rounded-full' />
            <h1 className='text-xl text-white'>{opname}</h1>
        </div>
        
    </div>
  )
}
