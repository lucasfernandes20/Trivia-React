import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SettingsIcon from '@material-ui/icons/Settings';
import logo from '../trivia.png';
import { actionGetGravatarImg } from '../redux/action';
import Loading from '../components/Loading';
import './Login.css';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      disableBtn: true,
      nameInput: '',
      email: '',
      redirect: false,
      toConfig: false,
      minLengthName: 3,
      loading: false,
    };
    this.validateEmail = this.validateEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchGravatar = this.fetchGravatar.bind(this);
    this.requestAPI = this.requestAPI.bind(this);
    this.redirectToConfig = this.redirectToConfig.bind(this);
    this.setInput = this.setInput.bind(this);
  }

  setInput() {
    return (
      <>
        <TextField
          id="name-helperText"
          label="Nome"
          variant="outlined"
          name="nameInput"
          onChange={ ({ target }) => this.handleChange(target) }
          inputProps={ { 'data-testid': 'input-player-name' } }
        />
        <TextField
          id="email-helperText"
          label="Email"
          type="email"
          helperText="Digite seu email do gravatar"
          variant="outlined"
          name="email"
          onChange={ ({ target }) => this.handleChange(target) }
          inputProps={ { 'data-testid': 'input-gravatar-email' } }
        />
      </>
    );
  }

  async requestAPI() {
    const endPoint = 'https://opentdb.com/api_token.php?command=request';
    let result = await fetch(endPoint);
    result = await result.json();
    localStorage.setItem('token', JSON.stringify(result.token));
    this.setState({
      loading: false,
      redirect: true,
    });
  }

  redirectToConfig() {
    this.setState({
      toConfig: true,
    });
  }

  validateEmail(emailValue) {
    const reg = /^[a-z0-9_.-]+@[a-z]+\.[a-z]{2,3}(?:\.[a-z]{2})?$/;
    this.setState({
      disableBtn: (!reg.test(emailValue)),
    });
  }

  handleChange(target) {
    const { value, name } = target;
    this.setState({
      [name]: value,
    });
    if (target.name === 'email') {
      this.validateEmail(target.value);
    }
  }

  async fetchGravatar() {
    const { email, nameInput } = this.state;
    const { setPlayerInfo } = this.props;
    this.setState({
      loading: true,
    });
    const toHash = md5(email).toString();
    const result = await fetch(`https://www.gravatar.com/avatar/${toHash}`);
    setPlayerInfo(result.url, nameInput);
    this.requestAPI();
  }

  render() {
    const { disableBtn, nameInput, redirect, toConfig,
      minLengthName, loading } = this.state;
    if (loading) {
      return <Loading />;
    }
    if (redirect) {
      return <Redirect to="/jogo" />;
    } if (toConfig) {
      return <Redirect to="/configs" />;
    }
    return (
      <section className="login-content">
        <div className="image-side">
          <img src={ logo } className="App-logo" alt="logo" />
        </div>
        <div className="login-side">
          <div className="box-login">
            {this.setInput()}
            <Button
              type="button"
              data-testid="btn-play"
              disabled={ disableBtn || nameInput.length < minLengthName }
              onClick={ () => this.fetchGravatar() }
              variant="contained"
              color="primary"
            >
              <PlayCircleFilledIcon />
              Jogar
            </Button>
            <Button
              type="button"
              data-testid="btn-settings"
              onClick={ () => this.redirectToConfig() }
              variant="contained"
              color="secondary"
            >
              <SettingsIcon />
              Configurações
            </Button>
          </div>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setPlayerInfo: (url, name) => dispatch(actionGetGravatarImg(url, name)),
});

Login.propTypes = {
  setPlayerInfo: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
