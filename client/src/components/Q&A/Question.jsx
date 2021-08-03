import React, { useState, useEffect } from 'react'
import Answer from './Answer.jsx'
import NewAnswer from './NewAnswer.jsx'
import token from '../../../../server/config/config.js'
import axios from 'axios'

// repeated code? will have to repeat this if i make a request from any component file?
const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax';
const auth = {
  headers: {
    Authorization: token
  }
};

function Question(props) {

  const [answersLimit, setAnswersLimit] = useState(2);
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const [temporaryAnswer, setTemporaryAnswer] = useState("")
  const [temporaryNickname, setTemporaryNickname] = useState("")

  //sorts by seller's answers and then by helpfulness
  const answersArr = Object.values(props.question.answers).sort(function (a, b) {
    if (a.answerer_name === "Seller" && b.answerer_name === "Seller") {
      return b.helpfulness - a.helpfulness;
    } else if (a.answerer_name === "Seller") {
      return -1;
    } else if (b.answerer_name === "Seller") {
      return 1;
    } else {
      return b.helpfulness - a.helpfulness;
    }
  });

  // renders desired number of answers on page with button to render more or less answers
  var moreAnswers;
  if (answersArr.length <= 2) {
    moreAnswers = null;
  } else if (answersLimit === answersArr.length) {
    moreAnswers = <button className="borderless-button" onClick={() => (setAnswersLimit(2))}>Collapse answers</button>
  } else if (answersArr.length > 2) {
    moreAnswers = <button className="borderless-button" onClick={() => (setAnswersLimit(answersArr.length))}>See more answers</button>
  }

  // update helpfulness score on question or answer
  function updateHelpfulness(event, id, currentHelpfulness) {
    var newHelpfulness = {
      helpfulness: currentHelpfulness + 1
    };
    axios.put(`${url}/qa/${event.target.name}/${id}/helpful`, newHelpfulness, auth)
      .then((response) => {
        console.log('updated')
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <li className="QA">
      <div className="question">
        <p className="boldTitle">Q: {props.question.question_body}</p>
        <span>
          Helpful?
          <button
            className="link-button"
            name="questions"
            onClick={!markedHelpful ? () => { updateHelpfulness(event, props.id, props.question.question_helpfulness); setMarkedHelpful(true) } : null}
          >Yes</button>
          ({!markedHelpful ? props.question.question_helpfulness : props.question.question_helpfulness + 1})
          |
          <NewAnswer
            productName={props.productName} question={props.question} setTemporaryAnswer={setTemporaryAnswer}
            setTemporaryNickname={setTemporaryNickname}
          />
        </span>
      </div>
      <div className="answers">
        {(answersArr.length === 0 && !temporaryAnswer) ? null : <p className="boldTitle">A:  </p>}
        <ul>
          {temporaryAnswer && (<li className="answer">
            <p>{temporaryAnswer}</p>
            <span>by {temporaryNickname}</span>
          </li>)}
          {answersArr.slice(0, answersLimit).map(answer => (
            <Answer
              key={answer.id}
              id={answer.id}
              answer={answer}
              updateHelpfulness={updateHelpfulness}
            />
          ))}
          {moreAnswers}
        </ul>
      </div>
    </li>
  )
}

export default Question;