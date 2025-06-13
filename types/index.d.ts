export { Restaurant }

declare global {
    interface RestaurantResponse {
        data: Restaurant[];
        status: string;
        total_results: number;
        nextPageToken?: string;
    }

    interface Restaurant {
        id: string;
        name: string;
        address: string;
        phone: string;
        cuisine: string;
        rating: number;
        rating_count: number;
        price_range: string;
        location: {
            latitude: number;
            longitude: number;
        };
        website_uri: string;
        google_maps_uri: string;
    }
}