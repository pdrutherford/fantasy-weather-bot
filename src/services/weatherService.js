const { randomInt } = require("crypto");

const weatherConditions = [
  "Sunny",
  "Cloudy",
  "Rainy",
  "Stormy",
  "Snowy",
  "Foggy",
  "Windy",
];

const temperatureRange = {
  min: -10,
  max: 35,
};

const getWeatherUpdate = () => {
  const condition = weatherConditions[randomInt(0, weatherConditions.length)];
  const temperature = randomInt(temperatureRange.min, temperatureRange.max + 1);
  const humidity = randomInt(20, 100);

  return {
    condition,
    temperature,
    humidity,
  };
};

module.exports = { getWeatherUpdate };
