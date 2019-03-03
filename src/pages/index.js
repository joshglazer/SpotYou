import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReactGA from 'react-ga';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import Layout from '../components/layout';
import Step1 from '../components/index/step1';
import Step2 from '../components/index/step2';
import Step3 from '../components/index/step3';
import { setStep } from '../state/app';

class IndexPage extends Component {

  async componentDidMount() {
    ReactGA.initialize(process.env.GATSBY_GA_UA_ID);
    if (this.props.spotifyAccessToken) {
      if (this.props.spotifyAccessToken === 'error') {
        toast.warn('Uh Oh! It looks like you did not agree to allow us to access your Spotify account. Please try again and make sure you click the "Agree" button.');
      }
    } else {
      this.props.setStep(1, true);
    }
  }

  render() {
    return (
      <Layout>
        <div className="text-center flex flex-col flex-1">
          <Step1 />
          <Step2 />
          <Step3 />
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange={false}
          draggable
          pauseOnHover={false}
        />
        <div className='sticky hidden'>
          This is needed so the .sticky class does not get purged from css
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    spotifyAccessToken: state.app.spotifyAccessToken,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setStep: (step, skipCheck) => { dispatch(setStep(step, skipCheck)) }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage);
