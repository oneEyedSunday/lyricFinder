enum eContext {
  TOPTRACKS,
  SEARCH,
}

interface SearchState {
  title: string;
  resultSize: string | number;
}

class UiState {
  heading = 'Lyric Finder App - Powered by MusixMatch';
  loading = true;
  error = undefined;
  context = 0;
  search = undefined;
}

interface UiStateInterface {
  heading: string;
  loading: boolean;
  error: string;
  context: eContext;
  search: SearchState;
}

// export as defaultUiState since i'm now
// importing via an index file
// defaultState is a generic name

const  defaultState: UiStateInterface = {
  heading: 'Lyric Finder App - Powered by MusixMatch',
  loading: false,
  error: undefined,
  context: 0,
  search: undefined
};

export {
  defaultState as defaultUiState,
  UiState,
  UiStateInterface,
  eContext
};
