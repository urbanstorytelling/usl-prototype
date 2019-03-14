// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  googleMaps: {
    api: 'AIzaSyA-LuH1M2TPttr7wQuuf5YS6ZlkLAKLtTQ'
  },
  firebase: {
    apiKey: 'AIzaSyDYAhCOugC1zknYFUO1WqYFpRHTmex5WyM',
    authDomain: 'usl-platform.firebaseapp.com',
    databaseURL: 'https://usl-platform.firebaseio.com',
    projectId: 'usl-platform',
    storageBucket: 'usl-platform.appspot.com',
    messagingSenderId: '744312534727'
  },
  mapbox: {
    accessToken: 'pk.eyJ1Ijoid2VidWlsZGNpdHkiLCJhIjoiY2pjdDRudTNnMGVrZTJxczI4bWM3bmEyZiJ9.HLOdHPPYaiorNG-p3X1SWA'
  }
};
