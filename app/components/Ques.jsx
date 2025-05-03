import React from 'react'

export default function Ques({ques}) {
    const {statement, id} = ques
    console.log(statement)
  return (
    <div className='text-2xl text-white p-2 w-full break-all h-full'>
        {statement}
    </div>
  )
}
