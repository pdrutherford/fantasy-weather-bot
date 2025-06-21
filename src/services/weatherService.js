// Simple seeded random number generator (Mulberry32)
// This ensures deterministic weather based on date
function seededRandom(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate a seed from a date (YYYY-MM-DD format)
function dateToSeed(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based to 1-based
  const day = date.getDate();

  // Create a unique seed by combining year, month, and day
  return year * 10000 + month * 100 + day;
}

// Seeded random integer function
function seededRandomInt(rng, min, max) {
  return Math.floor(rng() * (max - min)) + min;
}

// Seasonal weather patterns for Western European climate
const seasonalWeather = {
  spring: {
    dayConditions: [
      "Mild and sunny",
      "Partly cloudy with occasional showers",
      "Light rain",
      "Overcast with drizzle",
      "Bright with scattered clouds",
      "Cool and breezy",
      "Fresh with morning mist",
    ],
    nightConditions: [
      "Clear with mild temperatures",
      "Overcast with light drizzle",
      "Cloudy with occasional showers",
      "Cool and misty",
      "Partly cloudy",
      "Cool with gentle breeze",
      "Damp with patchy fog",
    ],
  },
  summer: {
    dayConditions: [
      "Warm and sunny",
      "Hot with clear skies",
      "Partly cloudy",
      "Thunderstorms in the afternoon",
      "Light breeze with sunshine",
      "Hazy sunshine",
      "Occasional summer showers",
    ],
    nightConditions: [
      "Warm with clear skies",
      "Mild and starry",
      "Partly cloudy",
      "Evening thunderstorms",
      "Gentle breeze and clear",
      "Hazy with warm air",
      "Light evening showers",
    ],
  },
  autumn: {
    dayConditions: [
      "Cool and crisp",
      "Overcast with light rain",
      "Foggy morning clearing to sun",
      "Blustery with heavy showers",
      "Misty and damp",
      "Grey skies with drizzle",
      "Windy with scattered clouds",
    ],
    nightConditions: [
      "Cool and crisp",
      "Overcast with steady rain",
      "Dense fog",
      "Windy with heavy showers",
      "Damp and misty",
      "Drizzly and grey",
      "Blustery with low clouds",
    ],
  },
  winter: {
    dayConditions: [
      "Cold and frosty",
      "Overcast with sleet",
      "Light snow flurries",
      "Icy conditions",
      "Thick fog",
      "Cold rain",
      "Bright but freezing",
    ],
    nightConditions: [
      "Frosty with clear skies",
      "Overcast with sleet",
      "Light snow falling",
      "Icy and treacherous",
      "Dense freezing fog",
      "Cold rain continuing",
      "Clear and bitterly cold",
    ],
  },
};

// Determine current season based on date
const getSeason = (date) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter"; // December, January, February
};

const getWeatherForDate = (date) => {
  const season = getSeason(date);
  const seasonData = seasonalWeather[season];

  // Create a seeded random generator based on the date
  const seed = dateToSeed(date);
  const rng = seededRandom(seed);

  // Generate day weather using seeded random
  const dayConditionIndex = seededRandomInt(
    rng,
    0,
    seasonData.dayConditions.length
  );
  const dayCondition = seasonData.dayConditions[dayConditionIndex];

  // Generate night weather using seeded random
  const nightConditionIndex = seededRandomInt(
    rng,
    0,
    seasonData.nightConditions.length
  );
  const nightCondition = seasonData.nightConditions[nightConditionIndex];

  // Format date
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Get day of week
  const dayOfWeek = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  return {
    date: formattedDate,
    dayOfWeek: dayOfWeek,
    season: season,
    day: {
      condition: dayCondition,
    },
    night: {
      condition: nightCondition,
    },
  };
};

const getWeeklyForecast = () => {
  const today = new Date();
  const forecast = [];

  // Generate forecast for the next 7 days
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    forecast.push(getWeatherForDate(forecastDate));
  }

  return forecast;
};

const getWeatherUpdate = () => {
  const currentDate = new Date();
  return getWeatherForDate(currentDate);
};

// Map weather conditions to appropriate emojis
const getWeatherEmoji = (condition, isNight = false) => {
  const conditionLower = condition.toLowerCase();

  // Snow and ice conditions
  if (conditionLower.includes("snow") || conditionLower.includes("flurries")) {
    return "❄️";
  }
  if (
    conditionLower.includes("icy") ||
    conditionLower.includes("frost") ||
    conditionLower.includes("freezing")
  ) {
    return "🧊";
  }
  if (conditionLower.includes("sleet")) {
    return "🌨️";
  }

  // Rain conditions
  if (
    conditionLower.includes("thunderstorm") ||
    conditionLower.includes("thunder")
  ) {
    return "⛈️";
  }
  if (conditionLower.includes("heavy") && conditionLower.includes("rain")) {
    return "🌧️";
  }
  if (
    conditionLower.includes("rain") ||
    conditionLower.includes("showers") ||
    conditionLower.includes("drizzle")
  ) {
    return "🌦️";
  }

  // Fog and mist
  if (conditionLower.includes("fog") || conditionLower.includes("mist")) {
    return "🌫️";
  }

  // Clear and sunny conditions
  if (
    conditionLower.includes("sunny") ||
    conditionLower.includes("bright") ||
    conditionLower.includes("clear")
  ) {
    if (isNight || conditionLower.includes("starry")) {
      return "🌟";
    }
    return "☀️";
  }

  // Cloudy conditions
  if (conditionLower.includes("overcast") || conditionLower.includes("grey")) {
    return isNight ? "☁️" : "☁️";
  }
  if (
    conditionLower.includes("partly cloudy") ||
    conditionLower.includes("scattered clouds")
  ) {
    return isNight ? "☁️" : "⛅";
  }
  if (conditionLower.includes("cloudy")) {
    return isNight ? "☁️" : "☁️";
  }

  // Windy conditions
  if (conditionLower.includes("blustery") || conditionLower.includes("windy")) {
    return "💨";
  }
  if (conditionLower.includes("breeze")) {
    return "🍃";
  }

  // Hazy conditions
  if (conditionLower.includes("hazy")) {
    return isNight ? "🌙" : "🌤️";
  }

  // Default based on general description
  if (conditionLower.includes("mild") || conditionLower.includes("warm")) {
    return isNight ? "🌙" : "🌤️";
  }
  if (conditionLower.includes("cool") || conditionLower.includes("cold")) {
    return isNight ? "❄️" : "❄️";
  }
  if (conditionLower.includes("hot")) {
    return "🔥";
  }

  // Default emoji
  return isNight ? "🌙" : "🌤️";
};

module.exports = {
  getWeatherUpdate,
  getWeeklyForecast,
  getWeatherForDate,
  getWeatherEmoji,
};
