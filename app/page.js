"use client"
import p1 from './assets/p1.jpg'
import p2 from './assets/p2.jpg'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import head from '@/app/assets/coc.png'
import srch from '@/app/assets/dd.gif'
import useSocket from './socket'
import { useRouter } from 'next/navigation'
import { signIn, } from 'next-auth/react'
import Navbar from './components/Navbar'
import { useSession } from 'next-auth/react'
import useIde from './ide'
import { getinfo } from './actions/firemethods'

export default function Home() {
  const {data:session} = useSession();
  const router = useRouter()
  const { setqs, setpid, setopid, setoppic, setpic, setpname, setopname, incmyqs, incopqs} = useIde();
const { socket, setmatch,mid} = useSocket();
const [isload, setLoad] = useState(false);
const [isvs, setvs] = useState(false);
const [op, setop] = useState(null);
console.log(mid);
console.log(session?.docid);

let myid = null;
useEffect(() => {
  //getdata();
  socket && socket.on('connect', ()=> {
    console.log(socket.id)
    //.on will actually a set listener on socket
    socket.on('receive', async message => {
      //setp(session?.docid)
      //console.log(message)
      if(message.comment === 'alone'){
        setLoad(false)
      }
      if(message.comment.includes('OPSINFO')){
        myid = message.comment.split('OPSINFO')[0]
        console.log('myid: ',myid)
      }
      if(message.comment.includes('OK')){
        const t = message.comment.split(':')[0]
        let mid = message.comment.split('~')[1]
        const matchid = mid.split('?')[0]

        let qs = JSON.parse(mid.split('?')[1])
        //console.log(message)
        //console.log(p, matchid, qs)
        setqs(qs)
        const opdata = await getinfo(t)
        console.log('op', opdata)
        setop(opdata.name)
        setpid(myid)
        console.log('myid', myid)
        const myinfo = await getinfo(myid)
        console.log('myinfo', myinfo)
        console.log('opinfo', opdata)
        setopid(t)
        setoppic(opdata.image)
        setpic(myinfo.image) 
        setpname(myinfo.name)
        setopname(opdata.name)
        console.log(matchid)
        setTimeout(()=>{
          setLoad(false)
          setvs(true)
          setmatch(matchid)
          setTimeout(()=>{
            router.push(`/match/${matchid}`)
            setvs(false)
          }, 3000)
        }, 5000)
      }
      if(message.comment == 'Failed'){
        setLoad(false)
      }
      
    })
  })

}, [socket,])
  


const senddata = async ()=>{
  if(!session){
    alert('Please sign in to continue!');
    return
  }
  const res = await fetch('http://localhost:8000/test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({sidb: socket.id, pidb: session.docid})
  })
  setLoad(true)
  const resp = await res.json();
  console.log(resp)
  socket.emit('send-message', `hello server from ${socket.id}`)
}

  return (
    <>
    <Navbar session={session}/>
    <div className='flex items-center justify-center flex-col h-screen'>

    {
      isvs ? (
        <div className='flex justify-between items-center flex-row w-full px-5'>
          <div className='flex justify-center items-center flex-col gap-5'>    
            <Image src={p1} width={100} height={100} alt='searching' />
           <h3 className='font-clash text-3xl'>{session.user.name}</h3> 
          </div>
          
          <div className='flex justify-center items-center flex-col gap-5'>    
           <h3 className='font-clash text-3xl font-extrabold'>VS</h3> 
          </div>

          <div className='flex justify-center items-center flex-col gap-5'>    
            <Image src={p2} width={100} height={100} alt='searching' />
           <h3 className='font-clash text-3xl'>{op}</h3> 
          </div>
        </div>
      )
      :

      !isload ? 
      
      (
      <>
        <Image src={head} width={800} height={800} alt='COC' />
        <button className='rounded-3xl px-6 py-1 bg-blue-800 text-white border-1 border-white text-2xl cursor-pointer' onClick={senddata}>Join</button>
      </>
      ) 
      
      :
      (
        <div className='flex justify-center items-center flex-row gap-5'>
          <h3 className='font-clash text-3xl'>Searching for opponents...</h3>
          <Image src={srch} width={40} height={40} alt='searching' unoptimized/>
        </div>
      )
    }
    </div>
    </>
  )
}
