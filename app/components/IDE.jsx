import Editor from '@monaco-editor/react';
import useIde from '../ide'
import Versus from './Versus';
import useSocket from '../socket';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IDE({ques}) {
    const {socket,mid, opponentId} = useSocket();
    const {placeholder,  driverCode, } = ques;
    const router = useRouter();
    const { theme,  langid, langdriver, code, setcode, qid, compmsg, comperr, compout, setlangid, settheme, setcompmsg, setcomperr, setcompout, incmyqs, incopqs} = useIde();
    const {data: session} = useSession()
      console.log(
          'code', code,
          'placeholder',placeholder
      );

    
    const handleRun = async () => {
        setcompmsg('Compiling...');
    
          console.log( opponentId, session?.user.docId,);
          
        try {
          const res = await fetch('http://localhost:9000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: driverCode + '\n' + code,
              langid: 52,
              stdin: ques.testCases[0].stdin,
              qid:ques.id,
              mid: mid,
              sida: socket.id,
              sidb: opponentId,
              pid: session?.user.docId,
              expOutput: ques.testCases[0].expectedOutput,
            }),
          });
    
          const data = await res.json();
          if(data.message === 'already solved'){
            setcomperr(null)
            setcompmsg('Already Solved');
            setcompout(null);
            alert('You have already solved this question!');
            return;
          }
          return data;
        } catch (err) {
          setcompmsg('Error');
          setcomperr('Something went wrong while submitting code');
        }
    
      };

      useEffect(() => {
        if(!socket) return;

        console.log(socket.id);
        
        const handleInc = (stdout) => {
          setcompmsg('Accepted!');
          setcomperr(null);
          setcompout(stdout);
          incmyqs()
        }
        
        const endmatch = (message) => {
          console.log(message);
          if(message.includes("won")){
            router.push('/win')
            return;
          }
          else if (message.includes("lost")) {router.push('/lose')}
          else router.push('/draw')
        }

        const handleFailed = (stdout, stderr) => {
          setcompmsg('Compilation Failed');
          setcomperr(stderr);
          setcompout(stdout);
        }

        const handleOpponent = (s) => {
          incopqs()
        }

          
        socket.on('code-failed', handleFailed)
        socket.on('inc-your-score', handleInc) 
        socket.on('inc-opponent-score', handleOpponent)
        socket.on('match-ended', endmatch)

        return () => {
          socket.off('code-failed', handleFailed)
          socket.off('inc-your-score', handleInc) 
          socket.off('inc-opponent-score', handleOpponent)
          socket.off('match-ended', endmatch)
        }
      }, [])
      
    return (
        <div className='flex flex-col gap-3 p-2 w-full h-full'>
         
            <div className='flex justify-between items-center flex-row w-full px-5'>
                <Editor className='p-4' height="60vh" 
                defaultLanguage={'cpp'} defaultValue={placeholder} 
                language={'cpp'} value={placeholder}  
                theme={ theme ? 'light' : 'vs-dark'} 
                onChange={(val) => setcode(val)}
                />
            </div>
            <div className='text-2xl text-white font-bold p-4'><pre>{ques.testCases[0].stdin} </pre></div>
            
            <div className='flex justify-between items-center flex-row w-full p-5'>
              <div className='flex justify-center items-center flex-col gap-5  w-[90%]'>
                      <h1 className='text-2xl text-orange-400'>Compiler Message: {compmsg}</h1>
                      <h1 className='text-2xl text-red'>Compiler Error: {comperr}</h1>
                      <h1 className='text-2xl text-blue-600'>Compiler Output: {compout}</h1>
              </div>
              <button className='bg-blue-500 text-white p-2 rounded-md w-[10%]' onClick={handleRun}>Run</button>
            </div>
        </div>
    )
}