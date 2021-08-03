import React, { useState, useEffect } from 'react'
import SearchBar from './SearchBar.jsx'
import QAList from './QAList.jsx'
import NewQuestion from './NewQuestion.jsx'
import token from '../../../../server/config/config.js'
import axios from 'axios'

const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax';
const auth = {
  headers: {
    Authorization: token
  }
};

function QAMain(props) {
  const [fullQuestionsList, setFullQuestionsList] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchPhrase, setSearchPhrase] = useState('');
  const [questionsLimit, setQuestionsLimit] = useState(2);
  const [temporaryQuestion, setTemporaryQuestion] = useState('');

  var currentProductId = props.product.id

  useEffect(() => {
    getQuestions(currentProductId);
  }, [currentProductId])

  // get and sort all questions by helpfulness
  function getQuestions(id) {
    axios.get(`${url}/qa/questions?count=100&product_id=${id}`, auth)
      .then((response) => {
        var sortedQuestions = response.data.results.sort(function (a, b) {
          return b.question_helpfulness - a.question_helpfulness;
        });
        setFullQuestionsList(sortedQuestions);
        setQuestions(sortedQuestions);
        setTemporaryQuestion('');
      })
      .catch((err) => {
        console.log(err);
      })
  }

  // filters questions based on the searchPhrase in the SearchBar
  function searchHandler(searchPhrase) {
    setSearchPhrase(searchPhrase);
    if (searchPhrase.length >= 3) {
      const splitSearchPhrase = searchPhrase.split(" ")
      const filteredQuestions = fullQuestionsList.filter(question => {
        function isIncluded(searchTerm) {
          return question.question_body.toLowerCase().includes(searchTerm.toLowerCase())
        }
        if (splitSearchPhrase.every(isIncluded)) {
          return question
        }
      })
      if (filteredQuestions.length > 0) {
        setQuestions(filteredQuestions)
      } else {
        setQuestions(fullQuestionsList)
      }
    }
    else {
      setQuestions(fullQuestionsList)
    }
  }

  // added functionality to render more questions on click
  var moreQuestions = (questionsLimit >= questions.length) ? null : <button className="boldTitle" className="functional-btn" onClick={() => (setQuestionsLimit(questionsLimit + 2))}>MORE ANSWERED QUESTIONS</button>

  return (
    <div id="QAContainer">
      <h1 className="inputsub">Questions & Answers</h1>
      <SearchBar
        searchPhrase={searchPhrase}
        searchHandler={searchHandler} setSearchPhrase={setSearchPhrase}
      />

      <QAList
        productName={props.product.name}
        questions={questions}
        getQuestions={getQuestions}
        questionsLimit={questionsLimit}
        temporaryQuestion={temporaryQuestion}
      />

      <div >
        {moreQuestions}
        <NewQuestion
          productName={props.product.name}
          productId={props.product.id}
          setTemporaryQuestion={setTemporaryQuestion}
        />
      </div>
    </div>
  )
}

export default QAMain