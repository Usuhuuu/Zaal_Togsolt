/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(modals)/SavedHalls` | `/(modals)/childModal` | `/(modals)/functions/UserProfile` | `/(modals)/functions/axiosInstanc` | `/(modals)/functions/friend` | `/(modals)/functions/refresh` | `/(modals)/functions/review` | `/(modals)/functions/savedhalls` | `/(modals)/functions/store` | `/(modals)/functions/thirdParty` | `/(modals)/login` | `/(modals)/sags` | `/(modals)/signup` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chat` | `/(tabs)/explore` | `/(tabs)/inbox` | `/(tabs)/profile` | `/SavedHalls` | `/_sitemap` | `/chat` | `/childModal` | `/explore` | `/functions/UserProfile` | `/functions/axiosInstanc` | `/functions/friend` | `/functions/refresh` | `/functions/review` | `/functions/savedhalls` | `/functions/store` | `/functions/thirdParty` | `/inbox` | `/listing/ZaalReview` | `/listing/friendRequest` | `/listing/notification` | `/login` | `/profile` | `/sags` | `/settings/mainSettings` | `/settings/profileSettings` | `/settings/settings_pages/Languages` | `/signup`;
      DynamicRoutes: `/listing/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/listing/[id]`;
    }
  }
}
