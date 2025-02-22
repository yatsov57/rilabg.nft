let weather = "clear";
let timeOfDay = 0;
let rainDrops = [];
let apiKey = "9ae2ea5cc9e7f67217e859308f1b531d"; 
let city = "Sofia";
function setup() {
  createCanvas(600, 400);
  for (let i = 0; i < 50; i++) {
    rainDrops.push({ x: random(width), y: random(height), speed: random(2, 5) });
  }
  fetchWeather();
}
function draw() {
  let skyColor = lerpColor(color(135, 206, 235), color(0, 0, 50), timeOfDay);
  background(skyColor);

  fill(100, 100, 100);
  noStroke();
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 20) {
    let y = height - 100 - noise(x * 0.01, frameCount * 0.01) * 50;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);

  let sunY = map(timeOfDay, 0, 1, height * 0.2, height * 0.8);
  fill(timeOfDay < 0.5 ? "#FFD700" : "#FFFFFF");
  ellipse(width * 0.75, sunY, 40, 40);
  if (weather === "rain") {
    stroke(255, 255, 255, 150);
    for (let drop of rainDrops) {
      line(drop.x, drop.y, drop.x, drop.y + 10);
      drop.y += drop.speed;
      if (drop.y > height) drop.y = -10;
    }
  }
}
function fetchWeather() {
  let url = `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey)}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      let parsedData = JSON.parse(data.contents);
      weather = parsedData.weather[0].main.toLowerCase();
      let sunrise = parsedData.sys.sunrise * 1000;
      let sunset = parsedData.sys.sunset * 1000;
      let now = Date.now();
      timeOfDay = constrain(map(now, sunrise, sunset, 0, 1), 0, 1);
      console.log("Weather:", weather, "Time of Day:", timeOfDay);
    })
    .catch(error => console.error("Error:", error));
}
