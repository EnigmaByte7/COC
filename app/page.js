"use client"
import p1 from './assets/p1.jpg'
import p2 from './assets/p2.jpg'
import coc from './assets/coc.png'
import dd from './assets/dd.gif'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useSocket from './socket'
import { useRouter } from 'next/navigation'
import { signIn, } from 'next-auth/react'
import Navbar from './components/Navbar'
import { useSession  } from 'next-auth/react'
import useIde from './ide'
import {v4} from 'uuid'

export default function Home() {
  const {data:session} = useSession();
  const router = useRouter()
  const { setqs, } = useIde();
  const { socket, setmatch,mid} = useSocket();
  const [isload, setLoad] = useState(false);
  const [matchdata, setmatchdata] = useState({})
  console.log("sesssion ", session);

  useEffect(() => {

    const getdata = async () => {
      if(!session){
        return
      }
      const res = await fetch('http://localhost:8080/getmatches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({uid: session.user.docId})
      })

      const data = await res.json();
      setmatchdata(data.message)
    }
    getdata()
    socket && socket.on('connect', () => {
      socket.on('match-created', async (matchId, opponentId, opponentName, opponentImage, questions, qsetid) => {
        
        console.log(matchId, opponentId, opponentName, opponentImage, questions, qsetid);
        
        setmatch(matchId, opponentId, opponentName, opponentImage)
        setqs(questions, qsetid)
        setTimeout(() => {
          router.push('/vs_page')
          setLoad(false)
        }, 4000);
      })


      socket.on('lobby-timeout', async (message) => {
        alert(message)
      })
    })


  }, [socket,session])



const senddata = async ()=>{
  if(!session){
    alert('Please sign in to continue!');
    return
  }
  
  const payload = session.user.docId + ":" + socket.id + "+" + session.user.name + "*" + session.user.image
  setLoad(true)
  socket.emit('join', payload)
  setTimeout(() => {
    setLoad(false)
  }, 16000)
}

  return (
    <>
    <Navbar session={session}/>
    <div className='flex items-center justify-center flex-col h-screen'>

    {
      !isload ? 
      
      (
      <div className='flex flex-col items-center justify-center gap-5'>
        <Image src={coc} width={800} height={800} alt='COC' /> 
        <button className='rounded-3xl px-6 py-1 bg-blue-800 text-white border-1 border-white text-2xl cursor-pointer' onClick={senddata}>Join</button>
        <div className='flex flex-row gap-6 my-16 mx-auto justify-center items-center font-clash'>
            <div className='flex flex-col justify-center items-center gap-3'>
              <div className='text-2xl'>Games played</div>
              <div className='text-xl'>{matchdata?.total}</div>
            </div>            
            <div className='flex flex-col justify-center  items-center gap-3'>
              <div className='text-2xl'>Games won</div>
              <div className='text-xl'>{matchdata?.won}</div>
            </div>            
            <div className='flex flex-col justify-center  items-center gap-3'>
              <div className='text-2xl'>Games lost</div>
              <div className='text-xl'>{matchdata?.lost}</div>
            </div>            
            <div className='flex flex-col justify-center  items-center gap-3'>
              <div className='text-2xl'>Games drawn</div>
              <div className='text-xl'>{matchdata?.drawn}</div>
            </div>
        </div>
      </div>
      ) 
      
      :
      (
        <div className='flex justify-center items-center flex-row gap-5'>
          <h3 className='font-clash text-3xl'>Searching for opponents...</h3>
          <Image src={dd} width={40} height={40} alt='searching' unoptimized/>
        </div>
      )
    }
    </div>
    </>
  )
}
