/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)/SavedHalls` | `/(modals)/childModal` | `/(modals)/context/Languages` | `/(modals)/context/authContext` | `/(modals)/context/errorContext` | `/(modals)/context/reduxStore` | `/(modals)/context/savedHall` | `/(modals)/functions/axiosInstance` | `/(modals)/functions/profile_data_fetch` | `/(modals)/functions/refresh` | `/(modals)/functions/review` | `/(modals)/functions/signup_modal` | `/(modals)/functions/third_party_instance` | `/(modals)/functions/useswr` | `/(modals)/login` | `/(modals)/sags` | `/(modals)/signup` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chat` | `/(tabs)/explore` | `/(tabs)/inbox` | `/(tabs)/profile` | `/SavedHalls` | `/_sitemap` | `/chat` | `/childModal` | `/context/Languages` | `/context/authContext` | `/context/errorContext` | `/context/reduxStore` | `/context/savedHall` | `/explore` | `/functions/axiosInstance` | `/functions/profile_data_fetch` | `/functions/refresh` | `/functions/review` | `/functions/signup_modal` | `/functions/third_party_instance` | `/functions/useswr` | `/inbox` | `/listing/ZaalReview` | `/listing/friendRequest` | `/listing/notification` | `/login` | `/profile` | `/sags` | `/settings/mainSettings` | `/settings/profileSettings` | `/signup`;
      DynamicRoutes: `/listing/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/listing/[id]`;
    }
  }
}
