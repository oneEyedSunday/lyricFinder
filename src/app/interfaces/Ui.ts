class UiState {
  heading = 'Lyric Finder App - Powered by MusixMatch';
  loading = true;
  error = undefined;
}

interface UiStateInterface {
  heading: string;
  loading: boolean;
  error: string;
}

const  defaultState: UiStateInterface = {
  heading: 'Lyric Finder App - Powered by MusixMatch',
  loading: false,
  error: undefined
};

export {
  defaultState,
  UiState,
  UiStateInterface
};
