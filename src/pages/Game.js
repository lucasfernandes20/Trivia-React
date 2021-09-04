/* eslint-disable max-lines-per-function */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import TimerOffSharpIcon from '@material-ui/icons/TimerOffSharp';
import Header from '../components/Header';
import Loading from '../components/Loading';
import Questions from '../components/Questions';
import CardQuestions from '../components/CardQuestions';
import './Game.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionNumber: 0,
      questions: [],
      loading: true,
      score: 0,
      assertions: 0,
      next: false,
      seconds: 30,
    };
    this.getQuestions = this.getQuestions.bind(this);
    this.getScore = this.getScore.bind(this);
    this.timer = this.timer.bind(this);
    this.buttonColorDisabler = this.buttonColorDisabler.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.enableButton = this.enableButton.bind(this);
    this.setToLocal = this.setToLocal.bind(this);
    this.gif = this.gif.bind(this);
  }

  componentDidMount() {
    const interval = 1000;
    this.getQuestions();
    this.count = setInterval(this.timer, interval);
  }

  componentDidUpdate() {
    const { assertions, score } = this.state;
    const { getUrl, getName } = this.props;
    const value = {
      player: {
        name: getName,
        assertions,
        score,
        gravatarEmail: getUrl,
      },
    };
    const myValue = JSON.stringify(value);
    localStorage.setItem('state', myValue);
  }

  setToLocal() {
    const player = JSON.parse(localStorage.getItem('state'));
    const defineObj = {
      name: player.player.name,
      score: player.player.score,
      picture: player.player.gravatarEmail,
    };
    if (localStorage.getItem('ranking')) {
      const ranking = JSON.parse(localStorage.getItem('ranking'));
      localStorage.setItem('ranking', JSON.stringify([...ranking, defineObj]));
    } else {
      localStorage.setItem('ranking', JSON.stringify([defineObj]));
    }
    return (
      <Redirect to="/feedback" />
    );
  }

  getQuestions() {
    const token = JSON.parse(localStorage.getItem('token'));
    fetch(`https://opentdb.com/api.php?amount=5&token=${token}`)
      .then((r) => r.json())
      .then((json) => this.setState({
        questions: [...json.results],
        loading: false,
      }));
  }

  getScore(target) {
    const { id, name } = target;
    const { assertions, score, seconds } = this.state;
    const right = 10;
    const notas = {
      hard: 3,
      medium: 2,
      easy: 1,
    };
    switch (name) {
    case 'correct': switch (id) {
    case 'hard': this.setState({
      score: right + ((seconds - 1) * notas.hard) + score,
      assertions: (assertions + 1),
    });
      break;
    case 'medium': this.setState({
      score: right + ((seconds - 1) * notas.medium) + score,
      assertions: (assertions + 1),
    });
      break;
    case 'easy': this.setState({
      score: right + ((seconds - 1) * notas.easy) + score,
      assertions: (assertions + 1),
    });
      break;
    default:
    }
      break;
    default:
    }
    this.buttonColorDisabler();
    this.timer(name);
  }

  timer(target) {
    const { seconds } = this.state;
    if (seconds === 0) {
      this.buttonColorDisabler();
      clearInterval(this.count);
    }
    if (seconds > 0) this.setState({ seconds: seconds - 1 });
    if (seconds === 0) {
      this.buttonColorDisabler();
      clearInterval(this.count);
    }
    switch (target) {
    case 'correct': clearTimeout(this.count);
      break;
    case 'incorrect': clearTimeout(this.count);
      break;
    default:
    }
  }

  buttonColorDisabler() {
    const correctAnswerButton = document.getElementsByClassName('c-answer');
    correctAnswerButton[0].setAttribute('disabled', 'disabled');
    correctAnswerButton[0].classList.add('correct-disabled');
    const incorrectAnswerButton = document.querySelectorAll('.w-answer');
    incorrectAnswerButton.forEach((button) => {
      button.setAttribute('disabled', 'disabled');
      button.classList.add('wrong-disabled');
    });
    this.setState({
      next: true,
    });
  }

  enableButton() {
    const correctAnswerButton = document.getElementsByClassName('c-answer');
    correctAnswerButton[0].removeAttribute('disabled', 'disabled');
    correctAnswerButton[0].classList.remove('correct-disabled');
    const incorrectAnswerButton = document.querySelectorAll('.w-answer');
    incorrectAnswerButton.forEach((button) => {
      button.removeAttribute('disabled', 'disabled');
      button.classList.remove('wrong-disabled');
    });
  }

  nextQuestion() {
    const interval = 1000;
    const resetTimer = 30;
    const { questionNumber } = this.state;
    this.setState({
      questionNumber: (questionNumber + 1),
      seconds: resetTimer,
      next: false,
    });
    this.count = setInterval(this.timer, interval);
    this.enableButton();
  }

  gif() {
    const { seconds } = this.state;
    if (seconds === 0) {
      return (
        <div>
          <TimerOffSharpIcon />
        </div>
      );
    }
  }

  render() {
    const { questions, questionNumber, loading, score, seconds, next } = this.state;
    const { getUrl, getName } = this.props;
    const max = 4;
    if (questionNumber > max) {
      return (
        <>
          { this.setToLocal() }
        </>
      );
    }
    if (!loading) {
      return (
        <main className="geral">
          <Header getUrl={ getUrl } getName={ getName } score={ score } />
          <div className="cardEndQuestions">
            <div>
              <CardQuestions
                questions={ questions }
                questionNumber={ questionNumber }
              />
            </div>
            <div className="timer-clock">
              <span className="seconds">{seconds > 0 ? seconds : this.gif()}</span>
            </div>
            <div className="anwser-btns">
              <Questions
                questions={ questions }
                questionNumber={ questionNumber }
                getScore={ this.getScore }
              />
              {
                next
                  ? (
                    <button
                      className="nextBtn"
                      type="button"
                      data-testid="btn-next"
                      onClick={ this.nextQuestion }
                    >
                      <span>
                        Próxima
                      </span>
                    </button>
                  )
                  : (
                    <button
                      className="nextBtnNone"
                      type="button"
                      data-testid="btn-next"
                      onClick={ this.nextQuestion }
                    >
                      <span>
                        Próxima
                      </span>
                    </button>)
              }
            </div>
          </div>
        </main>
      );
    }
    return (<Loading />);
  }
}

const mapStateToProps = (state) => ({
  getUrl: state.gravatar.url,
  getName: state.gravatar.name,
});
Game.propTypes = {
  getUrl: PropTypes.string.isRequired,
  getName: PropTypes.string.isRequired,
};
export default connect(mapStateToProps, null)(Game);
