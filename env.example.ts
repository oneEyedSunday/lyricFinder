const baseAPIURL = window.location.hostname === 'localhost' ? '/api' : 'https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/';

export default {
  'apiKey': 'your api key',
  'baseAPIURL': baseAPIURL
};
