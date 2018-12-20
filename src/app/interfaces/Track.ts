interface TrackType {
  track_name: string;
  album_name: string;
  artist_name: string;
  track_id: string;
  album_id: string;
  commontrack_id: string;
  primary_genres: any;
  explicit: string;
}


class TrackState {
 tracklist: TrackType[] = [];
 CurrentSearchTracks: TrackType[] = [];
 cachedTracks: TrackType[] = [];
}

export { TrackType, TrackState };
