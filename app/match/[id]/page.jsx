"use client"
import React, { useEffect,  } from 'react'
import useSocket from '@/app/socket'
import { useRouter } from 'next/navigation';
import IDE from '@/app/components/IDE';
import useIde from '@/app/ide';
import Controls from '@/app/components/Controls';
import Ques from '@/app/components/Ques';
import Versus from '@/app/components/Versus';

export default function page() {
  const router = useRouter();
  const {socket, mid,} = useSocket();
  const {qs, qid,setqid} = useIde()

 
  console.log(qs);
  
  useEffect( () => {
    // const verify = async () => {
    //   const res = await fetch('http://localhost:8000/verify', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({mid: mid})
    //   })

    //   const message = await res.json();
    //   console.log(message.comment)
    //   if(message.comment == 0){
    //     router.push('/')
    //   }
    // }
    // verify();

    const handleReceive = (message) => {
      console.log('Received message:', message);
  
      if (message.comment === 'won') {
        setw(true);
      } else if (message.comment === 'lose') {
        setl(true);
      }
      else if(message.comment === 'left') { 
        alert('Opponent left the game')
      }
      else if(message.comment === 'draw') {
        alert('Game Draw')
      }
    };
  
    socket.on('receive', handleReceive);
  
    return () => {
      socket.off('receive', handleReceive); 
    };

  }, [mid, socket])

  const nextques = ()=>{
    //0..1..2..3
    if(qid == 1) setqid(0);
    else setqid(qid + 1)
  }

  const prevques = () => {
    if(qid == 0) setqid(1)
      else setqid(qid - 1)
  }

  return (
    <div className='flex flex-col gap-3 p-2 w-full h-full bg-black'>
      <Versus />
      <Controls nextques={nextques} prevques={prevques} />
      <Ques ques={qs[qid]} />
      <IDE ques={qs[qid]}/>
    </div>
  )
}
