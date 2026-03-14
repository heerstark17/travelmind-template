const catalog = {
  Udaipur: {
    hotels: ["Jaiwana Haveli", "Hilltop Palace", "The Oberoi Udaivilas", "Trident Udaipur"],
    attractions: [
      { name: "City Palace", lat: 24.576, lng: 73.683 },
      { name: "Jagdish Temple", lat: 24.578, lng: 73.684 },
      { name: "Lake Pichola", lat: 24.575, lng: 73.681 },
      { name: "Saheliyon Ki Bari", lat: 24.601, lng: 73.68 },
      { name: "Fateh Sagar Lake", lat: 24.6, lng: 73.677 },
      { name: "Monsoon Palace", lat: 24.585, lng: 73.676 },
      { name: "Bagore Ki Haveli", lat: 24.577, lng: 73.681 },
      { name: "Ahar Cenotaphs", lat: 24.565, lng: 73.705 },
      { name: "Shilpgram", lat: 24.605, lng: 73.72 }
    ],
    restaurants: ["Ambrai", "Upre by 1559 AD", "Khamma Ghani", "Savage Garden"]
  },

  Jaipur: {
    hotels: ["Trident Jaipur", "Alsisar Haveli", "ITC Rajputana", "Fairmont Jaipur"],
    attractions: [
      { name: "Amber Fort", lat: 26.985, lng: 75.851 },
      { name: "Hawa Mahal", lat: 26.923, lng: 75.826 },
      { name: "City Palace Jaipur", lat: 26.925, lng: 75.823 },
      { name: "Jantar Mantar", lat: 26.924, lng: 75.823 },
      { name: "Nahargarh Fort", lat: 26.938, lng: 75.815 },
      { name: "Jaigarh Fort", lat: 26.985, lng: 75.846 },
      { name: "Albert Hall Museum", lat: 26.912, lng: 75.819 },
      { name: "Birla Mandir", lat: 26.892, lng: 75.815 }
    ],
    restaurants: ["Handi", "Rawat Mishtan Bhandar", "Masala Chowk", "1135 AD"]
  },

  Delhi: {
    hotels: ["The Imperial", "Taj Palace", "Leela Palace", "ITC Maurya"],
    attractions: [
      { name: "Red Fort", lat: 28.656, lng: 77.241 },
      { name: "India Gate", lat: 28.612, lng: 77.229 },
      { name: "Qutub Minar", lat: 28.524, lng: 77.185 },
      { name: "Lotus Temple", lat: 28.553, lng: 77.258 },
      { name: "Humayun's Tomb", lat: 28.593, lng: 77.25 },
      { name: "Akshardham Temple", lat: 28.612, lng: 77.277 },
      { name: "Connaught Place", lat: 28.631, lng: 77.216 },
      { name: "Chandni Chowk", lat: 28.65, lng: 77.23 }
    ],
    restaurants: ["Indian Accent", "Bukhara", "Karim's", "SodaBottleOpenerWala"]
  },

  Mumbai: {
    hotels: ["Taj Mahal Palace", "Trident Nariman Point", "The Oberoi Mumbai", "ITC Grand Central"],
    attractions: [
      { name: "Gateway of India", lat: 18.922, lng: 72.834 },
      { name: "Marine Drive", lat: 18.944, lng: 72.823 },
      { name: "Elephanta Caves", lat: 18.963, lng: 72.931 },
      { name: "Colaba Causeway", lat: 18.923, lng: 72.831 },
      { name: "Siddhivinayak Temple", lat: 19.017, lng: 72.83 },
      { name: "Juhu Beach", lat: 19.098, lng: 72.826 },
      { name: "Bandra-Worli Sea Link", lat: 19.017, lng: 72.817 }
    ],
    restaurants: ["Leopold Cafe", "The Table", "Bastian", "Britannia & Co."]
  },

  Goa: {
    hotels: ["Taj Exotica", "W Goa", "Leela Goa", "Alila Diwa Goa"],
    attractions: [
      { name: "Baga Beach", lat: 15.555, lng: 73.751 },
      { name: "Calangute Beach", lat: 15.543, lng: 73.755 },
      { name: "Anjuna Beach", lat: 15.573, lng: 73.743 },
      { name: "Fort Aguada", lat: 15.498, lng: 73.773 },
      { name: "Chapora Fort", lat: 15.596, lng: 73.739 },
      { name: "Basilica of Bom Jesus", lat: 15.5, lng: 73.911 },
      { name: "Dudhsagar Waterfalls", lat: 15.314, lng: 74.314 }
    ],
    restaurants: ["Pousada by the Beach", "Thalassa", "Gunpowder", "Mum's Kitchen"]
  },

  Manali: {
    hotels: ["The Himalayan", "Snow Valley Resort", "Manu Allaya", "Apple Country Resort"],
    attractions: [
      { name: "Solang Valley", lat: 32.316, lng: 77.157 },
      { name: "Hadimba Temple", lat: 32.243, lng: 77.189 },
      { name: "Rohtang Pass", lat: 32.371, lng: 77.246 },
      { name: "Mall Road Manali", lat: 32.243, lng: 77.189 },
      { name: "Jogini Waterfall", lat: 32.27, lng: 77.196 },
      { name: "Manu Temple", lat: 32.255, lng: 77.188 },
      { name: "Vashisht Hot Springs", lat: 32.252, lng: 77.19 }
    ],
    restaurants: ["Johnson's Cafe", "Cafe 1947", "The Lazy Dog", "Drifters' Cafe"]
  },

  Varanasi: {
    hotels: ["Brijrama Palace", "Taj Ganges", "Hotel Alka", "Radisson Varanasi"],
    attractions: [
      { name: "Kashi Vishwanath Temple", lat: 25.31, lng: 83.01 },
      { name: "Dashashwamedh Ghat", lat: 25.306, lng: 83.01 },
      { name: "Assi Ghat", lat: 25.288, lng: 83.006 },
      { name: "Manikarnika Ghat", lat: 25.31, lng: 83.013 },
      { name: "Sarnath", lat: 25.376, lng: 83.022 },
      { name: "Banaras Hindu University", lat: 25.267, lng: 82.991 }
    ],
    restaurants: ["Kashi Chat Bhandar", "Pizzeria Vaatika Cafe", "Baati Chokha", "Brown Bread Bakery"]
  },

  Rishikesh: {
    hotels: ["Aloha on the Ganges", "Divine Resort", "Ganga Kinare", "Ananda in the Himalayas"],
    attractions: [
      { name: "Lakshman Jhula", lat: 30.131, lng: 78.329 },
      { name: "Ram Jhula", lat: 30.123, lng: 78.327 },
      { name: "Triveni Ghat", lat: 30.109, lng: 78.293 },
      { name: "Neer Garh Waterfall", lat: 30.132, lng: 78.31 },
      { name: "Beatles Ashram", lat: 30.118, lng: 78.317 },
      { name: "Parmarth Niketan Ashram", lat: 30.126, lng: 78.327 }
    ],
    restaurants: ["Chotiwala", "Bistro Nirvana", "The Sitting Elephant", "Ganga View Cafe"]
  },

  Amritsar: {
    hotels: ["Hyatt Regency", "Taj Swarna", "Ramada Amritsar", "Radisson Blu Amritsar"],
    attractions: [
      { name: "Golden Temple", lat: 31.62, lng: 74.876 },
      { name: "Jallianwala Bagh", lat: 31.62, lng: 74.88 },
      { name: "Wagah Border", lat: 31.604, lng: 74.572 },
      { name: "Durgiana Temple", lat: 31.634, lng: 74.872 },
      { name: "Ram Bagh Gardens", lat: 31.629, lng: 74.872 }
    ],
    restaurants: ["Kesar Da Dhaba", "Bharawan Da Dhaba", "Makhan Fish", "Crystal Restaurant"]
  },

  Kerala: {
    hotels: ["Kumarakom Lake Resort", "Taj Bekal", "The Leela Kovalam", "Brunton Boatyard"],
    attractions: [
      { name: "Alleppey Backwaters", lat: 9.498, lng: 76.338 },
      { name: "Munnar Tea Gardens", lat: 10.088, lng: 77.059 },
      { name: "Athirappilly Falls", lat: 10.285, lng: 76.569 },
      { name: "Periyar Wildlife Sanctuary", lat: 9.462, lng: 77.236 },
      { name: "Fort Kochi", lat: 9.966, lng: 76.242 },
      { name: "Varkala Beach", lat: 8.735, lng: 76.702 }
    ],
    restaurants: ["Paragon", "Grand Pavilion", "Kashi Art Cafe", "Dhe Puttu"]
  },

  Bengaluru: {
    hotels: ["The Leela Palace", "Taj West End", "ITC Gardenia", "The Oberoi Bengaluru"],
    attractions: [
      { name: "Lalbagh Botanical Garden", lat: 12.95, lng: 77.584 },
      { name: "Cubbon Park", lat: 12.976, lng: 77.592 },
      { name: "Bangalore Palace", lat: 12.998, lng: 77.592 },
      { name: "ISKCON Temple", lat: 13.009, lng: 77.551 },
      { name: "MG Road", lat: 12.975, lng: 77.607 },
      { name: "Vidhana Soudha", lat: 12.979, lng: 77.591 }
    ],
    restaurants: ["MTR", "Truffles", "Toit", "Karavalli"]
  },

  Hyderabad: {
    hotels: ["Taj Falaknuma Palace", "ITC Kohenur", "Trident Hyderabad", "The Park Hyderabad"],
    attractions: [
      { name: "Charminar", lat: 17.361, lng: 78.474 },
      { name: "Golconda Fort", lat: 17.383, lng: 78.401 },
      { name: "Hussain Sagar", lat: 17.423, lng: 78.473 },
      { name: "Salar Jung Museum", lat: 17.371, lng: 78.48 },
      { name: "Birla Mandir Hyderabad", lat: 17.406, lng: 78.469 }
    ],
    restaurants: ["Paradise Biryani", "Bawarchi", "Shadab", "Olive Bistro"]
  },

  Kolkata: {
    hotels: ["Taj Bengal", "ITC Royal Bengal", "The Oberoi Grand", "JW Marriott Kolkata"],
    attractions: [
      { name: "Victoria Memorial", lat: 22.544, lng: 88.342 },
      { name: "Howrah Bridge", lat: 22.585, lng: 88.346 },
      { name: "Dakshineswar Kali Temple", lat: 22.655, lng: 88.357 },
      { name: "Park Street", lat: 22.553, lng: 88.352 },
      { name: "Indian Museum", lat: 22.564, lng: 88.352 }
    ],
    restaurants: ["Peter Cat", "6 Ballygunge Place", "Oh! Calcutta", "Arsalan"]
  },

  Chennai: {
    hotels: ["ITC Grand Chola", "Taj Coromandel", "The Leela Palace Chennai", "Hyatt Regency Chennai"],
    attractions: [
      { name: "Marina Beach", lat: 13.05, lng: 80.282 },
      { name: "Kapaleeshwarar Temple", lat: 13.033, lng: 80.27 },
      { name: "Fort St. George", lat: 13.082, lng: 80.287 },
      { name: "Santhome Basilica", lat: 13.032, lng: 80.278 },
      { name: "Guindy National Park", lat: 13.006, lng: 80.22 }
    ],
    restaurants: ["Murugan Idli Shop", "Dakshin", "Pan Asian", "Absolute Barbecues"]
  },

  Pune: {
    hotels: ["The Westin Pune", "Conrad Pune", "JW Marriott Pune", "Hyatt Pune"],
    attractions: [
      { name: "Shaniwar Wada", lat: 18.519, lng: 73.855 },
      { name: "Aga Khan Palace", lat: 18.552, lng: 73.901 },
      { name: "Sinhagad Fort", lat: 18.366, lng: 73.755 },
      { name: "Koregaon Park", lat: 18.536, lng: 73.893 }
    ],
    restaurants: ["Vaishali", "The Flour Works", "German Bakery", "Malaka Spice"]
  },

  Agra: {
    hotels: ["The Oberoi Amarvilas", "ITC Mughal", "Tajview", "Trident Agra"],
    attractions: [
      { name: "Taj Mahal", lat: 27.175, lng: 78.042 },
      { name: "Agra Fort", lat: 27.179, lng: 78.022 },
      { name: "Mehtab Bagh", lat: 27.183, lng: 78.024 },
      { name: "Itimad-ud-Daulah", lat: 27.186, lng: 78.004 }
    ],
    restaurants: ["Pinch of Spice", "Peshawri", "Joney's Place", "Dasaprakash"]
  },

  Chandigarh: {
    hotels: ["The Lalit Chandigarh", "Hyatt Regency Chandigarh", "JW Marriott Chandigarh", "Taj Chandigarh"],
    attractions: [
      { name: "Rock Garden", lat: 30.752, lng: 76.81 },
      { name: "Sukhna Lake", lat: 30.742, lng: 76.819 },
      { name: "Rose Garden", lat: 30.749, lng: 76.783 },
      { name: "Capitol Complex", lat: 30.758, lng: 76.806 }
    ],
    restaurants: ["Gopal's", "Pal Dhaba", "Swagath", "Virgin Courtyard"]
  },

  Shimla: {
    hotels: ["The Oberoi Cecil", "Wildflower Hall", "Radisson Jass", "Clarkes Hotel"],
    attractions: [
      { name: "The Ridge", lat: 31.104, lng: 77.173 },
      { name: "Mall Road Shimla", lat: 31.104, lng: 77.173 },
      { name: "Jakhoo Temple", lat: 31.105, lng: 77.186 },
      { name: "Kufri", lat: 31.099, lng: 77.267 }
    ],
    restaurants: ["Cafe Sol", "Wake & Bake", "Eighteen71 Cookhouse", "Honeymoon Inn"]
  }
};

const cityAliases = {
  bangalore: "Bengaluru",
  bengaluru: "Bengaluru",
  newdelhi: "Delhi",
  delhi: "Delhi",
  bomaby: "Mumbai",
  bombay: "Mumbai",
  mumbai: "Mumbai",
  calcutta: "Kolkata",
  kolkata: "Kolkata",
  trivandrum: "Kerala"
};

function normalizeCity(name) {
  if (!name) return "";
  return String(name).toLowerCase().replace(/[^a-z]/g, "");
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a) return b.length;
  if (!b) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function resolveCity(input) {
  const normalized = normalizeCity(input);
  if (!normalized) return null;

  if (cityAliases[normalized]) {
    const name = cityAliases[normalized];
    return { name, data: catalog[name] };
  }

  const cityNames = Object.keys(catalog);
  const normalizedMap = cityNames.map((name) => ({
    name,
    normalized: normalizeCity(name)
  }));

  const exact = normalizedMap.find((item) => item.normalized === normalized);
  if (exact) {
    return { name: exact.name, data: catalog[exact.name] };
  }

  let best = null;
  normalizedMap.forEach((item) => {
    const score = levenshtein(normalized, item.normalized);
    if (!best || score < best.score) {
      best = { name: item.name, score };
    }
  });

  if (!best) return null;

  const tolerance = Math.max(2, Math.ceil(normalized.length * 0.25));
  if (best.score <= tolerance) {
    return { name: best.name, data: catalog[best.name], corrected: true };
  }

  return null;
}

function listCities() {
  return Object.keys(catalog);
}

function getCityCenter(cityName) {
  const data = catalog[cityName];
  if (!data || !data.attractions || data.attractions.length === 0) {
    return null;
  }
  const sum = data.attractions.reduce(
    (acc, item) => {
      acc.lat += item.lat;
      acc.lng += item.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );
  return {
    lat: sum.lat / data.attractions.length,
    lng: sum.lng / data.attractions.length
  };
}

function haversineKm(a, b) {
  if (!a || !b) return Infinity;
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

function getNearbyCities(cityName, radiusKm = 20) {
  const center = getCityCenter(cityName);
  if (!center) return [];

  return Object.keys(catalog)
    .filter((name) => name !== cityName)
    .map((name) => {
      const otherCenter = getCityCenter(name);
      const distance = haversineKm(center, otherCenter);
      return {
        name,
        distance_km: Math.round(distance * 10) / 10
      };
    })
    .filter((item) => item.distance_km <= radiusKm)
    .sort((a, b) => a.distance_km - b.distance_km);
}

module.exports = {
  catalog,
  resolveCity,
  normalizeCity,
  listCities,
  getCityCenter,
  getNearbyCities
};
