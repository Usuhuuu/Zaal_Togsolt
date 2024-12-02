// types/ExpoConfig.d.ts
import { ExpoConfig } from '@expo/config-types';

declare module '@expo/config-types' {
  interface ExpoConfig {
    extra?: {
      apiUrl: string;
    };
  }
}
