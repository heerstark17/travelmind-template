import {useState} from "react"

import Navbar from "./components/Navbar"
import Hero from "./components/hero"
import PromptPlanner from "./components/PromptPlanner";
import Itinerary from "./components/Itinerary"

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

function App(){

const [trip,setTrip] = useState(null)
const [loading,setLoading] = useState(false)

return(

<div>

<Navbar/>

<Hero/>

<div className="container container-main">

<div className="row justify-content-center">

<div className="col-md-6">

<PromptPlanner
setTrip={setTrip}
setLoading={setLoading}
/>

</div>

</div>

{loading && (
<div className="text-center mt-4">
Generating itinerary...
</div>
)}

<Itinerary trip={trip}/>

</div>

</div>

)

}

export default App