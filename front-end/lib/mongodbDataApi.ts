import { createMongoDBDataAPI } from 'mongodb-data-api'

const apiKey = process.env.MONGO_API_KEY as string
const urlEndpoint = process.env.MONGO_URL_ENDPOINT as string 

if (!apiKey) {
    throw new Error("MONGO_API_KEY not found. Add MONGO_API_KEY to .env")
}

if (!urlEndpoint) {
    throw new Error("MONGO_URL_ENDPOINT not found. Add MONGO_URL_ENDPOINT to .env")
}

// init by URL Endpoint
const MongoDBDataApi = createMongoDBDataAPI({ apiKey, urlEndpoint })
export default MongoDBDataApi