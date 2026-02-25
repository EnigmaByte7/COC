"use client"
import coc from './assets/coc.png'
import dd from './assets/dd.gif'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import useSocket from './socket'
import { useRouter } from 'next/navigation'
import Navbar from './components/Navbar'
import { useSession, signIn } from 'next-auth/react'
import useIde from './ide'
import { getPlayerStats } from '../lib/stats'

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setqs } = useIde();
  const { socket, init, setmatch,setuser } = useSocket();
  const [isload, setLoad] = useState(false);
  const [matchdata, setmatchdata] = useState({ total: 0, wins: 0, losses: 0, draws: 0 });

  useEffect(() => {
    if (session?.user?.docId) {
      setuser(session.user);
      console.log('using docid', session.user);
      init(session.user);
    }
  }, [session?.user?.docId, init]);

  console.log(session);
  

  useEffect(() => {
    const getStats = async () => {
      if (!session?.user?.docId) return;
      try {
        const res = await getPlayerStats(session.user.docId);
        console.log('stats :::', res);
        setmatchdata(res);
      } catch (e) {
        console.error("Stats fetch failed", e);
      }
    };
    getStats();
  }, [session]);

  useEffect(() => {
    if (!socket) return;

    socket.on('match_found', (data) => {
      console.log(data);
      
      setmatch(data.matchId, data.opponent.id, data.opponent.name, data.opponent.image);
      setqs(data.questions, 0);
      console.log(data.endTime);
      
      useIde.setState({
        opname: data.opponent.name,
        oppic: data.opponent.image,
        pname: session?.user?.name,
        ppic: session?.user?.image,
        endTime: data.endTime
      })
      setLoad(false);
      router.push('/vs_page');
    });

    socket.on('queue:timeout', () => {
      setLoad(false);
      alert("No opponents found. Try again.");
    });

    return () => {
      socket.off('match:found');
      socket.off('match:sync');
      socket.off('queue:timeout');
    };
  }, [socket, router, setmatch, setqs]);

  const handleJoin = () => {
    if (!session) {
      signIn('google');
      return;
    }
    setLoad(true);
    socket.emit('join_queue');
  };
  console.log(session?.disconnected);
  

  return (
    <div className='flex min-h-screen w-full'>
      <Navbar session={session} />
      <div className='flex items-center justify-center flex-col h-screen relative'>
            <div className='text-xl absolute bottom-20 left-20 '> 
              {
                socket?.disconnected ? (
                  <div className='flex flex-row items-center gap-2'>
                    <div className='w-3 h-3 animate-ping rounded-full bg-red-400'></div>
                    Disconnected
                  </div>
                ) : (
                 <div className='flex flex-row items-center gap-2'>
                    <div className='w-3 h-3 animate-ping rounded-full bg-green-400'></div>
                    Connected
                  </div>
                )
              }
            </div>
        {!isload ? (
          <div className='flex flex-col items-center justify-center gap-5 '>
            <Image src={coc} width={800} height={800} alt='COC' priority />
            <button 
              className='rounded-3xl px-6 py-1 bg-blue-800 text-white border-1 border-white text-2xl cursor-pointer' 
              onClick={handleJoin}
            >
              Join
            </button>
            <div className='flex flex-row gap-6 my-16 mx-auto justify-center items-center font-clash'>
              <div className='flex flex-col justify-center items-center gap-3'>
                <div className='text-2xl'>Games played</div>
                <div className='text-xl'>{matchdata?.total || 0}</div>
              </div>
              <div className='flex flex-col justify-center items-center gap-3'>
                <div className='text-2xl'>Games won</div>
                <div className='text-xl'>{matchdata?.wins || 0}</div>
              </div>
              <div className='flex flex-col justify-center items-center gap-3'>
                <div className='text-2xl'>Games lost</div>
                <div className='text-xl'>{matchdata?.losses || 0}</div>
              </div>
              <div className='flex flex-col justify-center items-center gap-3'>
                <div className='text-2xl'>Games drawn</div>
                <div className='text-xl'>{matchdata?.draws || 0}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className='flex justify-center items-center flex-row gap-5'>
            <h3 className='font-clash text-3xl'>Searching for opponents...</h3>
            <Image src={dd} width={40} height={40} alt='searching' unoptimized />
          </div>
        )}
      </div>
    </div>
  )
}