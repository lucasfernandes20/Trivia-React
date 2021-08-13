import React, { Component } from 'react';
import { Card } from '@material-ui/core';
import PropTypes from 'prop-types';

class CardQuestions extends Component {
  render() {
    const { questions, questionNumber } = this.props;
    return (
      <Card>
        <div className="secondsEndCategory">
          <h1 data-testid="question-category">
            { questions[questionNumber].category }
          </h1>
        </div>
        <p data-testid="question-text" className="asking">
          { questions[questionNumber].question }
        </p>
      </Card>
    );
  }
}

CardQuestions.propTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    question: PropTypes.string.isRequired,
  })).isRequired,
  questionNumber: PropTypes.number.isRequired,
};
export default CardQuestions;
