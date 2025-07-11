// Simple seeded random number generator (Mulberry32)
// This ensures deterministic weather based on date and region
function seededRandom(seed) {
  let a = seed ^ 0xdeadbeef; // Change the initial seed to be offset by a constant
  return function () {
    a |= 0;
    a = (a + 0x7f4a7c15) | 0; // Change the increment constant
    let t = Math.imul(a ^ (a >>> 13), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 9), 61 | t)) ^ t; // Change the shift values
    return ((t ^ (t >>> 11)) >>> 0) / 4294967296; // Change the final shift
  };
}

// Generate a seed from a date and region (YYYY-MM-DD format)
function dateToSeed(date, regionId = "default") {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-based to 1-based
  const day = date.getDate();

  // Create a unique seed by combining year, month, day, and region
  // Use simple string hash for region to ensure different regions have different weather
  let regionHash = 0;
  for (let i = 0; i < regionId.length; i++) {
    regionHash =
      ((regionHash << 5) - regionHash + regionId.charCodeAt(i)) & 0xffffffff;
  }

  return year * 10000 + month * 100 + day + (regionHash % 1000);
}

// Seeded random integer function
function seededRandomInt(rng, min, max) {
  return Math.floor(rng() * (max - min)) + min;
}

// Determine current season based on date
const getSeason = (date) => {
  const month = date.getMonth() + 1; // getMonth() returns 0-11

  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter"; // December, January, February
};

const getWeatherForDate = (
  date,
  seasonalWeatherConfig,
  regionId = "default"
) => {
  const season = getSeason(date);

  // Require seasonal weather config - no fallback to default
  if (!seasonalWeatherConfig) {
    throw new Error(
      `Seasonal weather configuration is required for region: ${regionId}`
    );
  }

  const seasonData = seasonalWeatherConfig[season];

  if (!seasonData) {
    throw new Error(
      `No weather data found for season '${season}' in region: ${regionId}`
    );
  }

  // Create a seeded random generator based on the date and region
  const seed = dateToSeed(date, regionId);
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

  // Get mechanical impacts if they exist
  const mechanicalImpacts = seasonData.mechanicalImpacts || {};
  const dayMechanicalImpact = mechanicalImpacts[dayCondition] || null;
  const nightMechanicalImpact = mechanicalImpacts[nightCondition] || null;

  // Format date
  const formattedDate = date.toLocaleDateString("en-US", {
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
      mechanicalImpact: dayMechanicalImpact,
    },
    night: {
      condition: nightCondition,
      mechanicalImpact: nightMechanicalImpact,
    },
  };
};

const getWeeklyForecast = (seasonalWeatherConfig, regionId = "default") => {
  const today = new Date();
  const forecast = [];

  // Generate forecast for the next 7 days
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    forecast.push(
      getWeatherForDate(forecastDate, seasonalWeatherConfig, regionId)
    );
  }

  return forecast;
};

const getWeatherUpdate = (seasonalWeatherConfig, regionId = "default") => {
  const currentDate = new Date();
  return getWeatherForDate(currentDate, seasonalWeatherConfig, regionId);
};

// Regional weather functions for easier usage
const getRegionalWeatherUpdate = (regionConfig) => {
  return getWeatherUpdate(regionConfig.seasonalWeather, regionConfig.id);
};

const getRegionalWeeklyForecast = (regionConfig) => {
  return getWeeklyForecast(regionConfig.seasonalWeather, regionConfig.id);
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
  getRegionalWeatherUpdate,
  getRegionalWeeklyForecast,
};
