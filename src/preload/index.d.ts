import { ElectronAPI } from '@electron-toolkit/preload'



declare global {
  interface ApiObject {
    showYoutube: boolean;
    showTwitch: boolean;
    twitchChannelName: string;
    youtubeChannelName: string;
    showAvatar: boolean;
    showBadges: boolean;
    backgroundBubbleOwner: string;
    backgroundBubbleChat: string;
    appBackgroundColor: string;
  }
  
  interface ApiObject {
    config: ConfigObject;
    updateConfig: (newConfig: any) => void;
  }
  
  interface Window {
    electron: ElectronAPI
    api: ApiObject
  }
}
