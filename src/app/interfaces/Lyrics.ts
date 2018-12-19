interface LyricInterface {
  text: string;
}

interface LyricObjectInterface {
  [id: string]: LyricInterface;
}

class LyricsState {
  lyrics: LyricObjectInterface[];
}

export { LyricsState, LyricInterface, LyricObjectInterface };
