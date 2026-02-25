"use client"
import React, { useEffect, useId,  } from 'react'
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
    socket?.on('match:sync', (data) => {
      console.log('resync..', data);

      const { scores, status } = data;
      useIde.setState({ myqs: 0, opqs: 0 });

      if (scores) {
        Object.keys(scores).forEach(uid => {
          if (uid === socket?.auth?.token) {
            useIde.setState({ myqs: scores[uid] });
          } else {
            useIde.setState({ opqs: scores[uid] });
          }
        });
      }
    });

    return () => {
      socket?.off('match:sync');
    };

  }, [mid, socket?.id])

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
    <div className='flex flex-col gap-5 p-2 w-full h-full bg-black'>
      <Versus />
      <Controls nextques={nextques} prevques={prevques} />
      <div className='flex flex-row gap-4'>
        <Ques ques={qs[qid]} />
        <IDE ques={qs[qid]} />
      </div>
    </div>
  )
}
