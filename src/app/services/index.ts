import { uiStore as ui } from '../services/ui.service';
import { TracksStore as tracks } from '../services/tracks.service';


export const services = [
    ui,
    tracks
];

export * from '../services/tracks.service';
export * from '../services/ui.service';

export default services;
