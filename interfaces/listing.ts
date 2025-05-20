interface SportHallFeature {
  changingRoom: boolean;
  shower: boolean;
  lighting: boolean;
  spectatorSeats: boolean;
  parking: boolean;
  freeWifi: boolean;
  scoreboard: boolean;
  speaker: boolean;
  microphone: boolean;
  tennis: boolean;
  billiards: boolean;
  darts: boolean;
}
interface SportHallLocation {
  latitude: string;
  longitude: string;
}

export interface SportHallDataType {
  sportHallID: string;
  name: string;
  address: string;
  imageUrls: string[];
  phoneNumber: string;
  workTime: string;
  price:string;
  location: {
    latitude: string;
    longitude: string;
    smart_location?:string
  };
  availableTimeSlots: {
    start_time?: string;
    end_time?: string;
  }[];
  listing_url?:string;
  feature: SportHallFeature;
}