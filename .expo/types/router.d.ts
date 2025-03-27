/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)/SavedHalls` | `/(modals)/childModal` | `/(modals)/context/Languages` | `/(modals)/context/authContext` | `/(modals)/functions/UserProfile` | `/(modals)/functions/axiosInstanc` | `/(modals)/functions/friend` | `/(modals)/functions/refresh` | `/(modals)/functions/review` | `/(modals)/functions/savedhalls` | `/(modals)/functions/store` | `/(modals)/functions/thirdParty` | `/(modals)/login` | `/(modals)/sags` | `/(modals)/signup` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chat` | `/(tabs)/explore` | `/(tabs)/inbox` | `/(tabs)/profile` | `/SavedHalls` | `/_sitemap` | `/chat` | `/childModal` | `/context/Languages` | `/context/authContext` | `/explore` | `/functions/UserProfile` | `/functions/axiosInstanc` | `/functions/friend` | `/functions/refresh` | `/functions/review` | `/functions/savedhalls` | `/functions/store` | `/functions/thirdParty` | `/inbox` | `/listing/ZaalReview` | `/listing/friendRequest` | `/listing/notification` | `/login` | `/profile` | `/sags` | `/settings/mainSettings` | `/settings/profileSettings` | `/signup`;
      DynamicRoutes: `/listing/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/listing/[id]`;
    }
  }
}
