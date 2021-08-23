import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Header.css';
import HomeIcon from '@material-ui/icons/Home';

class Header extends React.Component {
  render() {
    const { getUrl, getName, score } = this.props;
    return (
      <header className="header-content">
        <div className="header-player">
          <div className="top-header">
            <div className="player-info">
              <img
                className="img-info"
                data-testid="header-profile-picture"
                src={ getUrl }
                alt="Profile"
              />
              <div className="line" />
              <h4 className="name-info" data-testid="header-player-name">{getName}</h4>
            </div>
          </div>
          <Link to="/" style={ { textDecoration: 'none' } }>
            <h3 style={ { color: 'whitesmoke' } } className="HomeIcon">
              <HomeIcon fontSize="large" />
              Home
            </h3>
          </Link>
        </div>
        <div className="bottom-header">
          <p>score</p>
          <h5 className="score" data-testid="header-score">{score}</h5>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  getUrl: state.gravatar.url,
  getName: state.gravatar.name,
});

Header.propTypes = {
  getUrl: PropTypes.string.isRequired,
  getName: PropTypes.string,
  score: PropTypes.number.isRequired,
};

Header.defaultProps = {
  getName: '',
};

export default connect(mapStateToProps, null)(Header);
