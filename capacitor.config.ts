import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cae2d0fe60f34c529704fbd26cc9dcd9',
  appName: 'EcoSwap',
  webDir: 'dist',
  server: {
    url: "https://cae2d0fe-60f3-4c52-9704-fbd26cc9dcd9.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera']
    }
  }
};

export default config;