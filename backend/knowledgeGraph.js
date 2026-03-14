const questions = {

destination:{
question:"Enter destination",
type:"text"
},

duration:{
question:"Trip duration",
type:"dropdown",
options:["1","2","3","4","5"]
},

budget:{
question:"Budget",
type:"dropdown",
options:["Low (INR 2000/day)","Medium (INR 4000/day)","High (INR 6000+/day)"]
},

travel_style:{
question:"Travel style",
type:"dropdown",
options:["Cultural","Adventure","Nature","Food","Relaxation"]
},

preferred_hotel:{
question:"Preferred hotel (optional)",
type:"text"
},

checkin_date:{
question:"Check-in date",
type:"date"
},

checkout_date:{
question:"Check-out date",
type:"date"
},

collaboration:{
question:"Travel collaboration",
type:"dropdown",
options:["Solo planning","Planning with friends","Family group","Team trip"]
},

travel_companion:{
question:"Travel companion",
type:"dropdown",
options:["Solo","Partner","Friends","Family","Colleagues"]
},

accommodation:{
question:"Accommodation",
type:"dropdown",
options:["Budget hotel","3 star","5 star","Resort"]
}

}

module.exports = questions
