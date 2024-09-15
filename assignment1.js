const serverVerbs = ["GET", "GET", "GET", "POST", "GET", "POST"];
const serverPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout"];
const serverResponses = [
  "Welcome to WEB700 Assignment 1",
  "This assignment was prepared by Prashanth Sultan Harinath",
  "Prashanth Sultan Harinath:psultan-harinath@myseneca.ca",
  "User Logged In",
  "Main Panel",
  "Logout Complete"
];
function httpRequest(httpVerb, path) {
    for (let i = 0; i < serverPaths.length; i++) {
        if (serverVerbs[i] === httpVerb && serverPaths[i] === path) {
            return `200: ${serverResponses[i]}`;
        }
    }
    
    return `404: Unable to process ${httpVerb} request for ${path}`;
}

console.log(httpRequest("GET", "/")); // Expected: "200: Welcome to WEB700 Assignment 1"
console.log(httpRequest("GET", "/about")); // Expected: "200: This assignment was prepared by Student Name"
console.log(httpRequest("GET", "/contact")); // Expected: "200: Student Name: Student Email"
console.log(httpRequest("POST", "/login")); // Expected: "200: User Logged In"
console.log(httpRequest("POST", "/logout")); // Expected: "200: Logout Complete"
console.log(httpRequest("PUT", "/")); // Expected: "404: Unable to process PUT request for /"
console.log(httpRequest("GET", "/randomPath")); // Expected: "404: Unable to process GET request for /randomPath"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function automateTests() {
    const testVerbs = ["GET", "POST"];
    const testPaths = ["/", "/about", "/contact", "/login", "/panel", "/logout", "/randomPath1", "/randomPath2"];

    function randomRequest() {
        const randVerb = testVerbs[getRandomInt(testVerbs.length)];
        const randPath = testPaths[getRandomInt(testPaths.length)];
        console.log(httpRequest(randVerb, randPath));
    }

    setInterval(randomRequest, 1000);
}

automateTests();
