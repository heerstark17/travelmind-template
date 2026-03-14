export async function createTrip(prompt){

  const res = await fetch(
    "http://localhost:4000/api/trip/from-prompt",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({prompt})
    }
  )

  return res.json()
}