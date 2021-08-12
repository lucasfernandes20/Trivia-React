import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    const { getUrl, getName, score } = this.props;
    return (
      <header>
        <img
          style={ { width: '90px', borderRadius: '50px' } }
          data-testid="header-profile-picture"
          src={ getUrl }
          alt="Profile"
        />
        <div className="headerGame">
          <h4 data-testid="header-player-name">{getName}</h4>
          <h5 data-testid="header-score">{score}</h5>
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
