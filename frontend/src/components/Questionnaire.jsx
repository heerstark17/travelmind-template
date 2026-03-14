import { useState } from "react"

export default function Questionnaire({onComplete}){

  const [answers,setAnswers] = useState({
    budget:"",
    travelStyle:"",
    food:"",
  })

  function select(key,value){

    setAnswers({
      ...answers,
      [key]:value
    })
  }

  function submit(){

    const refinedPrompt = `
    ${answers.travelStyle} trip,
    ${answers.budget} budget,
    food preference: ${answers.food}
    `

    onComplete(refinedPrompt)
  }

  return(

    <div className="card">

      <h2 className="title">Trip Preferences</h2>

      <h4>Budget</h4>

      {["budget","mid","luxury"].map(v=>(
        <div
          key={v}
          className="option"
          onClick={()=>select("budget",v)}
        >
          {v}
        </div>
      ))}

      <h4>Travel Style</h4>

      {["culture","nature","nightlife"].map(v=>(
        <div
          key={v}
          className="option"
          onClick={()=>select("travelStyle",v)}
        >
          {v}
        </div>
      ))}

      <h4>Food Preference</h4>

      {["street food","fine dining","local cuisine"].map(v=>(
        <div
          key={v}
          className="option"
          onClick={()=>select("food",v)}
        >
          {v}
        </div>
      ))}

      <button className="button" onClick={submit}>
        Continue
      </button>

    </div>

  )
}