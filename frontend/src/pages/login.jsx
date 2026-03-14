import { useNavigate } from "react-router-dom"

export default function Home(){

  const navigate = useNavigate()

  return(

    <div className="container">

      <div className="card">

        <h1 className="title">
          AI Travel Planner
        </h1>

        <p>
          Plan intelligent itineraries using AI and knowledge graphs.
        </p>

        <br/>

        <button
          className="button"
          onClick={()=>navigate("/trip")}
        >
          Start Planning
        </button>

      </div>

    </div>

  )
}