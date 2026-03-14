export default function Itinerary({ data }) {

  const itinerary = data.itinerary || {};

  return (
    <div>

      <h2>{data.city} Trip</h2>

      <h3>Hotel Suggestions</h3>

      {itinerary.hotelSuggestions?.map((hotel,i)=>(
        <p key={i}>{hotel}</p>
      ))}

      <h3>Daily Plan</h3>

      {itinerary.days?.map(day=>(
        <div key={day.day}>

          <h4>Day {day.day}</h4>

          {day.activities.map((a,i)=>(
            <p key={i}>• {a}</p>
          ))}

        </div>
      ))}

    </div>
  );
}