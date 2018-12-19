interface LyricInterface {
  text: string;
  error: string;
}

interface LyricObjectInterface {
  [id: string]: LyricInterface;
}

class LyricsState {
  lyrics: {};
}

export { LyricsState, LyricInterface, LyricObjectInterface };
