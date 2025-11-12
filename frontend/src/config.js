
const isProduction = process.env.NODE_ENV === "production";
const PRODUCTION_URL = import.meta.env.PRODUCTION_URL;

export const API_BASE_URL = isProduction
	? PRODUCTION_URL // Replace with your production URL
	: "http://localhost/silvercel_inventory_system/backend/api";
