const { randomInt } = require("crypto");

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

const getWeatherUpdate = () => {
  const currentDate = new Date();
  const season = getSeason(currentDate);
  const seasonData = seasonalWeather[season];

  // Generate day weather
  const dayCondition =
    seasonData.dayConditions[randomInt(0, seasonData.dayConditions.length)];

  // Generate night weather (using night-specific conditions)
  const nightCondition =
    seasonData.nightConditions[randomInt(0, seasonData.nightConditions.length)];

  // Format date
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return {
    date: formattedDate,
    season: season,
    day: {
      condition: dayCondition,
    },
    night: {
      condition: nightCondition,
    },
  };
};

module.exports = { getWeatherUpdate };
