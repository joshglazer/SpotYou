import ReactGA from 'react-ga';

const initialState = {
  step: 1,
  spotifyAccessToken: false,
  spotifyPlaylists: [],
};

ReactGA.initialize(process.env.GATSBY_GA_UA_ID);

const RESET = 'RESET';
const SET_STEP = 'SET_STEP';
const SPOTIFY_CONNECT = 'SPOTIFY_CONNECT';

export const reset = () => ({ type: RESET });
export const setStep = (step, skipCheck=false) => ({ type: SET_STEP, payload: {step, skipCheck} });
export const spotifyConnect = accessToken => ({ type: SPOTIFY_CONNECT, payload: accessToken });


export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case RESET:
      return initialState;
    case SET_STEP:
      if (!payload.skipCheck && payload.step > state.step) {
        return state;
      } else {
        ReactGA.pageview(`Step ${payload.step}`);
        return {
          ...state,
          step: payload.step,
        };
        /*
        if (step !== 3) {
          this.setState({
            video: null
          })
        }
        */
      }
    case SPOTIFY_CONNECT:
      return {
        ...state,
        spotifyAccessToken: payload,
      };
    default:
      return state;
  }
};
