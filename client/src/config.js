let BASE_URL = "https://academic-jenelle-ahmedessamyouns-6af08e63.koyeb.app/";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:4000/";
}

export { BASE_URL };
