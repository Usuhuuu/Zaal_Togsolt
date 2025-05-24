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

interface SportHallPrice {
  oneHour: string;
    wholeDay: string;
}
interface SportHallWorkTime {
  startTime: string;
  endTime: string;
}


export interface SportHallDataType {
  sportHallID: string;
  name: string;
  address: string;
  imageUrls: string[];
  phoneNumber: string;
  workTime: SportHallWorkTime;
  price:SportHallPrice;
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