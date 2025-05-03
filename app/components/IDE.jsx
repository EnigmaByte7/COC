import Editor from '@monaco-editor/react';
import useIde from '../ide'
import Versus from './Versus';
import useSocket from '../socket';
import { useSession } from 'next-auth/react';

export default function IDE({ques}) {
  const {socket,mid} = useSocket();
    const {placeholder, driver, } = ques;
    const { theme,  langid, langdriver, code, setcode, qid, compmsg, comperr, compout, setlangid, settheme, setcompmsg, setcomperr, setcompout} = useIde();
  const {data: session} = useSession()
    console.log(
        'code', code,
        'placeholder',placeholder
    );
    
    const handleRun = async () => {
        setcompmsg('Compiling...');
    
        try {
          const res = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: driver + '\n' + code,
              langid: 52,
              stdin: ques.stdin,
              qid:ques.id - 1,
              mid: mid,
              sida: socket.id,
              pid: session?.docid
            }),
          });
    
          const data = await res.json();
    
          console.log('data', data);
          setcompmsg(data.status?.description || 'error');
          setcompout(data.stdout || '');
          setcomperr(data.stderr || data.compile_output || '');
        } catch (err) {
          setcompmsg('Error');
          setcomperr('Something went wrong while submitting code');
        }
    
      };

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
            <div className='text-2xl text-white font-bold p-4'>{ques.stdin}</div>
            
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