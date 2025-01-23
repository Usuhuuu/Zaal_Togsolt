export interface ListingGeo {
  type: string;
  geometry: Geometry;
  properties: Properties;
}

interface Properties {
  id: string;
  listing_url: string;
  scrape_id: string;
  last_scraped: string;
  name: string;
  summary: null | string;
  space: null | string;
  description: string;
  experiences_offered: string;
  neighborhood_overview: null | string;
  notes: null | string;
  transit: null | string;
  access: null | string;
  interaction: null | string;
  house_rules: null | string;
  thumbnail_url: null | string;
  medium_url: null | string;
  picture_url: Pictureurl | null;
  xl_picture_url: null | string;
  host_id: string;
  host_url: string;
  host_name: string;
  host_since: string;
  host_location: null | string;
  host_about: null | string;
  host_response_time: string;
  host_response_rate: number;
  host_acceptance_rate: null;
  host_thumbnail_url: string;
  host_picture_url: string;
  host_neighbourhood: null | string;
  host_listings_count: number;
  host_total_listings_count: number;
  host_verifications: string[];
  street: string;
  neighbourhood: null | string;
  neighbourhood_cleansed: string;
  neighbourhood_group_cleansed: string;
  city: string;
  state: null | string;
  zipcode: null | string;
  market: null | string;
  smart_location: string;
  country_code: string;
  country: string;
  latitude: string;
  longitude: string;
  property_type: string;
  room_type: string;
  accommodates: number;
  bathrooms: null | number;
  bedrooms: null | number;
  beds: number;
  bed_type: string;
  amenities: string[];
  square_feet: null | number;
  price: number;
  weekly_price: null | number;
  monthly_price: null | number;
  security_deposit: null | number;
  cleaning_fee: null | number;
  guests_included: number;
  extra_people: number;
  minimum_nights: number;
  maximum_nights: number;
  calendar_updated: string;
  has_availability: null;
  availability_30: number;
  availability_60: number;
  availability_90: number;
  availability_365: number;
  calendar_last_scraped: string;
  number_of_reviews: number;
  first_review: null | string;
  last_review: null | string;
  review_scores_rating: null | number;
  review_scores_accuracy: null | number;
  review_scores_cleanliness: null | number;
  review_scores_checkin: null | number;
  review_scores_communication: null | number;
  review_scores_location: null | number;
  review_scores_value: null | number;
  license: null;
  jurisdiction_names: null;
  cancellation_policy: string;
  calculated_host_listings_count: number;
  reviews_per_month: null | number;
  features: string[];
}

interface Pictureurl {
  thumbnail: boolean;
  filename: string;
  format: string;
  width: number;
  mimetype: string;
  etag: string;
  id: string;
  last_synchronized: string;
  color_summary: string[];
  height: number;
}

interface Geometry {
  type: string;
  coordinates: number[];
}