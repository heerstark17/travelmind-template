import { useState } from "react"
import Questionnaire from "../components/Questionnaire"
import { createTrip } from "../api"

export default function Trip(){

  const [prompt,setPrompt] = useState("")
  const [quizPrompt,setQuizPrompt] = useState("")
  const [trip,setTrip] = useState(null)

  async function generate(){

    const finalPrompt = prompt + " " + quizPrompt

    const data = await createTrip(finalPrompt)

    setTrip(data)
  }

  return(

    <div className="container">

      <div className="card">

        <h1 className="title">
          Plan Your Trip
        </h1>

        <input
          className="input"
          placeholder="Example: 3 day trip to Delhi"
          value={prompt}
          onChange={e=>setPrompt(e.target.value)}
        />

        <Questionnaire
          onComplete={(p)=>setQuizPrompt(p)}
        />

        <br/>

        <button
          className="button"
          onClick={generate}
        >
          Generate Trip
        </button>

      </div>

      {trip && (

        <div className="card result-section">

          <h2>
            {trip.city} • {trip.days} days
          </h2>

          <h3>Experiences</h3>

          {trip.experiences.map(e=>(
            <div className="item" key={e._id}>
              {e.name}
            </div>
          ))}

          <h3>Itinerary</h3>

          <p>{trip.itinerary}</p>

        </div>

      )}

    </div>

  )
}