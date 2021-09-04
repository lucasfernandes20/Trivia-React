import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CardQuestions extends Component {
  render() {
    const { questions, questionNumber } = this.props;
    return (
      <section className="game-questions">
        <div className="question">
          <p data-testid="question-text" className="asking">
            { questions[questionNumber].question }
          </p>
        </div>
        <div className="category-question-line" />
        <div className="category">
          <h1 data-testid="question-category">
            { questions[questionNumber].category }
          </h1>
        </div>
      </section>
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
