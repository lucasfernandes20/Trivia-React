import React from 'react';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import './Ranking.css';

class Ranking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
    };
    this.shouldRedirect = this.shouldRedirect.bind(this);
  }

  shouldRedirect() {
    this.setState({
      redirect: true,
    });
  }

  // eslint-disable-next-line max-lines-per-function
  render() {
    const getRanking = JSON.parse(localStorage.getItem('ranking'));
    const sortRanking = getRanking.sort((a, b) => b.score - a.score);
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/" />;
    }
    return (
      <section className="section-ranking">
        <div className="ranking-content">
          <h2 className="title" data-testid="ranking-title">Ranking</h2>
          <ul className="ranking-list">
            <li className="li-header">
              <p className="p-li">Foto de Perfil</p>
              <p className="p-li">Nome</p>
              <p className="p-li">Score</p>
            </li>
            {sortRanking.map((e, index) => (
              <li key={ e.picture } className="li-ranking">
                <div className="li-div">
                  <img src={ e.picture } alt="player pic" id="user-pic" />
                </div>
                <div className="li-div">
                  <p id="" data-testid={ `player-name-${index}` }>{e.name}</p>
                </div>
                <div className="li-div">
                  <p
                    className="score"
                    data-testid={ `player-score-${index}` }
                  >
                    {e.score}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Button
          type="button"
          className="go-back-btn"
          data-testid="btn-go-home"
          variant="contained"
          color="secondary"
          onClick={ () => this.shouldRedirect() }
        >
          <ArrowBackIcon />
          Início
        </Button>
      </section>
    );
  }
}

export default Ranking;
