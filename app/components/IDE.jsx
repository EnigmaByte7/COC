import Editor from '@monaco-editor/react';
import useIde from '../ide';
import useSocket from '../socket';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IDE({ ques }) {
  const { socket, mid, opponentId } = useSocket();
  const router = useRouter();
  const { data: session } = useSession();

  const { theme, codes, setCode, compmsg, comperr, compout,  setcompmsg, setcomperr, setcompout } = useIde();
  console.log(ques);
  
  const handleRun = async () => {
    setcompmsg('Compiling...');
    setcomperr(null);
    setcompout(null);
    try {
        const res = await fetch('http://localhost:3000/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codes[ques.id] + '\n' + ques.driverCode,
          languageId: 54,
          stdin: ques.testCases[0].input,
          matchId: mid,
          expOutput: ques.testCases[0].output,
          problemId: ques.id,
          userId: session?.user?.docId,
        }),
      });

      const data = await res.json();
      if(res.ok){
        console.log('sumbimittes');
        return
      }
    }
    catch(e){
      console.log(e);
    }
  };

  useEffect(() => {
    if(!socket) return;
    socket.on('submission:update', (data) => {
      console.log(data);
      
      const { status, stdout, stderr, compile_output } = data;
      if (status === 'accepted') {
        setcompmsg('Accepted!');
        setcomperr(null);
        setcompout(stdout || "All test cases passed.");
      } else if (status === 'wrong') {
        setcompmsg('Wrong Answer');
        setcomperr(stderr); 
        setcompout(stdout);
      } else {
        setcompmsg('Error');
        setcomperr(compile_output || stderr);
        setcompout(null);
      }
    });

    socket.on('match:update', (data) => {
      console.log('updatig match.......', data);
      
      const myId = session?.user?.docId;
      
      const scores = data.scores;
      Object.keys(scores).forEach(uid => {
        if (uid === myId) useIde.setState({ myqs: scores[uid] });
        else useIde.setState({ opqs: scores[uid] });
      });

      if (data.status === 'FINISHED') {
        console.log(socket?.auth?.token, data.winner);
        if (data.winner === socket?.auth?.token) router.push('/win');
        else if (data.winner === 'DRAW') router.push('/draw');
        else router.push('/lose');

        useIde.getState().resetIde()
        useSocket.getState().resetSocket()
      }
    });

  
    return () => {
      socket.off('submission:update');
      socket.off('match:update');
    };
  }, [socket?.id]);
    const safeAtob = (str) => {
    try {
      return str ? atob(str) : "";
    } catch (e) {
      return str; 
    }
  };


  if(!ques) return <div className="text-white">Loading question...</div>;

  return (
    <div className='flex flex-col w-full h-full bg-[#1e1e1e] rounded-xl overflow-hidden border border-zinc-800 shadow-2xl'>
      <div className='flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0'>
        <div className='flex items-center gap-2'>
          <div className='flex gap-1.5'>
            <span className='w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700'></span>
            <span className='w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700'></span>
            <span className='w-2.5 h-2.5 rounded-full bg-zinc-800 border border-zinc-700'></span>
          </div>
          <span className='ml-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest'>C++17 • Solution.cpp</span>
        </div>
      </div>

      <div className='flex-grow relative h-[60vh]'>
        <Editor
          height="100%"
          defaultLanguage="cpp"
          theme="vs-dark"
          value={codes[ques.id] || ques.placeholder}
          onChange={(val) => setCode(ques.id, val)}
          options={{
            fontSize: 15,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 20 },
            fontFamily: 'Fira Code, monospace',
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
          }}
        />
      </div>

      <div className='bg-zinc-900 border-t border-zinc-800 shrink-0'>
        <div className='px-4 py-3 flex justify-between items-center bg-zinc-900/50'>
          <div className='flex items-center gap-3'>
            <div className={`w-2 h-2 rounded-full ${compmsg === 'Accepted!' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`}></div>
            <span className={`text-[11px] font-black uppercase tracking-tight ${compmsg === 'Accepted!' ? 'text-green-500' : 'text-zinc-500'}`}>
              {compmsg || "Console Ready"}
            </span>
          </div>
          <button 
            onClick={handleRun} className='bg-blue-600 hover:bg-blue-500 text-white px-8 py-1.5 rounded text-[11px] font-black tracking-widest transition-all active:scale-95' >
            SUBMIT
          </button>
        </div>

        {(comperr || compout) && (
          <div className='max-h-48 overflow-y-auto p-4 border-t border-zinc-800 bg-black/20'>
            {comperr && (
              <div className='mb-3'>
                <p className='text-[10px] font-bold text-red-500 uppercase mb-1 tracking-widest'>Compile Erro</p>
                <pre className='text-xs text-red-400 font-mono whitespace-pre-wrap leading-relaxed'>{safeAtob(comperr)}</pre>
              </div>
            )}
            {compout && (
              <div>
                <p className='text-[10px] font-bold text-blue-500 uppercase mb-1 tracking-widest'>Output</p>
                <pre className='text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed'>{safeAtob(compout)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}