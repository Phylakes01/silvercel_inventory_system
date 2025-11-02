
const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = isProduction
	? "https://your-production-domain.com/backend/api" // Replace with your production URL
	: "http://localhost/react_inventory_system/backend/api";
