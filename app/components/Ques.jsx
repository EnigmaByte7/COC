import React from 'react'

export default function Ques({ques}) {
  if(!ques) return null;
    const {statement, id, testCases, } = ques
    console.log(statement,id, testCases, );
    return (  
            <div className='text-2xl text-white p-2 w-full break-all h-full'>
                {statement}
            </div>
      )
  
}
