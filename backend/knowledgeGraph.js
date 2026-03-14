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
options:["Low","Medium","High"]
},

travel_style:{
question:"Travel style",
type:"dropdown",
options:["Cultural","Adventure","Nature","Food","Relaxation"]
},

accommodation:{
question:"Accommodation",
type:"dropdown",
options:["Budget hotel","3 star","5 star","Resort"]
}

}

module.exports = questions