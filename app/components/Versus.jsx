import React, { use, useEffect, useState } from 'react'
import useIde from '../ide'
import useSocket from '../socket'
import { useSession } from 'next-auth/react'
import { REACTION_MAP, VALID_CODES } from './constants/emojis'

export default function Versus() {
    const {  myqs, opqs, incmyqs, incopqs,ppic,pname, endTime, } = useIde()
    const myval = (Number(myqs) / 2) * 100
    const [hud, setHud] = useState(false)
    const {data: session} = useSession();
    const [opReaction, setOpReaction] = useState(null)
    
    const {socket, opponentName, opponentImage , mid} = useSocket()
    const opval = ((2 - Number(opqs)) / 2) * 100
    console.log(myqs, opqs);
    console.log(socket);
    const [timeLeft, setTimeLeft] = React.useState("00:00");

    useEffect(() => {
        if (!endTime) return;

        const timer = setInterval(() => {
            const now = Date.now();
            const distance = endTime - now;
            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft("00:00");
                return;
            }
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    const sendReaction = (reaction) => {
        socket?.emit('reaction', {
            matchId: mid,
            userId: session?.user?.docId,
            reaction: reaction,
        })
        setHud(false);
    }

    useEffect(() => {
        if (!socket) return;
        let timer;
        const handleReaction = (data) => {
            console.log(data);
            const { reaction } = data;
            setOpReaction(reaction);

            timer = setTimeout(() => {
                setOpReaction(null);
            }, 5000)
        };
        socket.on('reaction', handleReaction);
        return () => {
            if (timer) clearTimeout(timer);
            socket.off('reaction', handleReaction);
        };
    }, [socket])

    console.log(opReaction);
    

  return (
    <div className='flex flex-row p-6 gap-6 w-full justify-between items-center bg-zinc-950 rounded-2xl'>
        <div className='flex flex-col gap-2 justify-center items-center min-w-[120px] relative'>
            <img src={ppic} alt="pic" className='w-20 h-20 rounded-full border-2 border-amber-300 object-cover' />
            <h1 className='text-lg font-bold text-white truncate max-w-[120px]'>{pname}</h1>

            <div className='flex flex-col items-center justify-center gap-4 absolute  bottom-0 translate-y-full'>
                <button onClick={() => setHud((hud) => !hud)} className='flex-shrink rounded-full p-1 text-xl bg-gray-200'>🤠</button>

                <div className={`px-3 py-1 flex flex-row gap-1 rounded-4xl bg-gray-200 overflow-hidden whitespace-nowrap transition-all duration-300 ease-out ${hud ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0'}`}>
                    {
                        Object.entries(REACTION_MAP).map((entry, index) => {
                            return (
                                <button onClick={() => sendReaction(entry[0])} className='px-1 py-1 text-lg hover:scale-150 hover:rotate-12 hover:animate-bounce cursor-pointer' key={index}>{entry[1][1]}</button>
                            )
                        })
                    }
                </div>
            </div>
           
        </div>
    
        <div className='flex flex-row items-center w-full gap-0 h-8 bg-zinc-900 rounded-full border-2 border-zinc-800  relative'>

            <div className='h-full w-[50%] flex items-center' >
                <span className='h-full bg-amber-400 transition-all duration-500 ease-out' style={{ width: `${myval}%` }}></span>
            </div>

            <div className='flex-grow h-full bg-transparent border-x border-zinc-800'></div>
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-white border-6 border-zinc-500 px-6 py-2 rounded-xl shadow-xl'>
                    <span className='text-xl  text-zinc-900 font-mono tracking-tighter'>
                        {timeLeft}
                    </span>
            </div>

            <div className='h-full bg-red-500 flex w-[50%]'>
                <span className='bg-zinc-900 transition-all duration-500 ease-out' style={{ width: `${opval}%` }} ></span>
            </div>
        </div>

        <div className='flex flex-col gap-2 justify-center items-center min-w-[120px] relative'>
            <img src={opponentImage} alt="pic" className='w-20 h-20 rounded-full border-2 border-red-500 object-cover ' />
            <h1 className='text-lg font-bold text-white truncate max-w-[120px]'>{opponentName}</h1>
           { opReaction && 
            
            (<div className='absolute left-0 -translate-x-full transition-all animate-bounce z-30'>
                    <div className='bg-white px-4 py-2 rounded-xl shadow-2xl border-2 border-zinc-100 relative'>
                        <img 
                            src={REACTION_MAP[opReaction][0]} 
                            className='w-12 h-12 rounded-lg' 
                            alt="reaction" 
                        />
                        <div className='absolute right-0 top-1/2 translate-x-1/2 w-3 h-3 z-[-1] bg-white rotate-45 border-b-2 border-r-2 border-zinc-100'></div>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}
