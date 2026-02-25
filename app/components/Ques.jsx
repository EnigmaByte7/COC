import React from 'react'

export default function Ques({ques}) {
  console.log(ques);
  if (!ques) return <div className="text-white">Loading question...</div>;

  const { title, description, constraints, id, testCases } = ques;

  return (
  <div className='flex flex-col gap-6 text-white p-6 w-full h-full overflow-y-auto min-h-[60vh] bg-zinc-900 rounded-xl border border-zinc-800 shadow-xl'>
      <div className="flex flex-col gap-1 border-b border-zinc-800 pb-4">
        <div className="flex justify-between items-center">
          <h2 className='text-3xl font-extrabold text-white tracking-tight'>{title}</h2>
          <span className="px-2 py-1 bg-zinc-800 rounded text-[10px] text-zinc-400 font-mono uppercase border border-zinc-700">
            {id}
          </span>
        </div>
      </div>
      
      <div className='text-[17px] leading-7 text-zinc-300 whitespace-pre-wrap font-sans'>
        {description}
      </div>

      {testCases && testCases.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">Example 1</h3>
          <div className="bg-black/40 rounded-lg p-4 font-mono text-sm border border-zinc-800">
            <div className="mb-2 flex gap-2">
              <span className="text-zinc-500 italic shrink-0">Input: </span>
              <span className="text-zinc-200 break-all">{testCases[0].input}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-zinc-500 italic shrink-0">Output: </span>
              <span className="text-zinc-200 break-all">{testCases[0].output}</span>
            </div>
          </div>
        </div>
      )}

      {constraints && (
        <div className="p-4 bg-zinc-950/50 rounded-lg border-l-4 border-amber-500/50">
          <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Constraints</h3>
          <p className="font-mono text-sm text-zinc-400">{constraints}</p>
        </div>
      )}

    </div>
  )
}
