let BASE_URL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:4000/";
} else {
  BASE_URL = 'https://cafe-connect-production.up.railway.app'; 
}

export { BASE_URL };
