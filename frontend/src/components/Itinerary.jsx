import { useState } from "react"
import API from "../api"

export default function PlannerPanel({setTrip,setLoading}){

const [prompt,setPrompt] = useState("")

const generate = async()=>{

try{

setLoading(true)

const res = await API.post("/prompt",{prompt})

setTrip(res.data)

}catch(err){

console.error(err)

}

setLoading(false)

}

return(

<div className="glass-card">

<h5 className="mb-3">
Plan with Prompt
</h5>

<textarea
className="form-control mb-3"
placeholder="Example: 3 day cultural trip to Udaipur"
onChange={(e)=>setPrompt(e.target.value)}
/>

<button
className="btn btn-light w-100"
onClick={generate}
>
Generate Itinerary
</button>

</div>

)

}