import { uiStore as ui } from './ui.service';
import { TracksStore as tracks } from './tracks.service';
import { lyricStore as lyrics } from './lyric.service';


export const services = [
    ui,
    tracks,
    lyrics
];

export * from './tracks.service';
export * from './ui.service';
export * from './lyric.service';

export default services;
