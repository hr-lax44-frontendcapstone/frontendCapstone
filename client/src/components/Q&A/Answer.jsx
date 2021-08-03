import React, { useState, useEffect } from 'react'
import token from '../../../../server/config/config.js'
import axios from 'axios'

const url = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax';
const auth = {
  headers: {
    Authorization: token
  }
};

function Answer(props) {
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const [reportAnswer, setReportAnswer] = useState(false);

  //convert ISO time stamp to time obj and then to useable format
  var dateStr = props.answer.date;
  var dateObj = new Date(dateStr);
  var longEnUSFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  var formattedDate = longEnUSFormatter.format(dateObj)

  function report(id){
    console.log(id)
    axios.put(`${url}/qa/answers/${id}/report`,{}, auth)
      .then((response) => {
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <li className="answer">
      <p> {props.answer.body}</p>
      <span>
        by {(props.answer.answerer_name === "Seller") ?<strong>{props.answer.answerer_name}</strong> : props.answer.answerer_name}, {formattedDate} | Helpful?
        <button
          className="link-button"
          name="answers"
          onClick={!markedHelpful ? ()=>{props.updateHelpfulness(event, props.id, props.answer.helpfulness); setMarkedHelpful(true)} : null}
        >Yes</button>
        ({!markedHelpful ? props.answer.helpfulness : props.answer.helpfulness + 1})
        |
        <button className="link-button" onClick={() => {report(props.id); setReportAnswer(true)}}>{(reportAnswer) ? 'Reported' : 'Report'}</button>
      </span>
    </li>
  )
}

export default Answer;