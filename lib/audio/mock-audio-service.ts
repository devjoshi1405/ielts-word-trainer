import { productionAudioService } from "./production-audio-service";
import { IAudioService, IAudioPlaybackOptions } from "./audio-service.interface";

export type { IAudioService, IAudioPlaybackOptions };
export { productionAudioService, productionAudioService as audioService };

