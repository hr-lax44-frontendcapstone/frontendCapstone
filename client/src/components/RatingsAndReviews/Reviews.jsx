// NOTE SHOULD THE FILTER BE A STATE, so it rerenders?
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import ReviewTiles from "./ReviewTiles.jsx";
const key = require('../../../../server/config/config.js');
import Select from 'react-select';
import sorters from './ReviewsSorters.jsx';
import Ratings from './Ratings';
import WriteNewReview from './WriteNewReview';

// NOTE:
// I am importing the response from axios and sifting them into seperate arrays. This will take more of a page loading time, but the app will work much faster after
// the initial page load, because the data will have already been sorted. Granted, when a put request is added, I am going to have to resort everything.

var Reviews = (props) => {

  // PRODUCT ID IS HARDCODED IN. USE A AXIOS CALL TO GET THEM OR GET THEM FROM THE MAIN STORE IF USING REDUX
  let productID = props.product.id
  let [isPageloading, makeIsPageLoading] = useState(true);
  let [numberOfReviews, makeNumberOfReviews] = useState(2);
  let [reviewSorter, makeReviewSorter] = useState({value: 'Relevance', label: 'Relevance'});
  let [reviewsSortedByHelpfulness, makeReviewsSortedByHelpfulness] = useState([]);
  let [reviewsSortedByRelevance, makeReviewsSortedByRelevance] = useState([]);
  let [reviewsSortedByDate, makeReviewsSortedByDate] = useState([]);
  let [reviewsMeta, makeReviewsMeta] = useState({});

    // note the filter function will be looking for characters that are NOT IN THE ARRAY
  let [reviewFilters, dispatchReviewFilters] = useReducer((state=[], action) => {
    switch(action.type) {
      case 'add':
        return [...state, action.reviewNumber]
      case 'remove':
        return [...state].filter(element => element !== action.reviewNumber)
      case 'removeAll':
        return []
      default:
        return state;
    }
  }, []);

  // This useEffect is fetching the reviews from a specific product ID. It is then changing the state of the reviews var to include all of the review data.
  // This will only run on mount
  useEffect(() => {
    // Doing inital data load for componenet did mount
    axios.get(`http://localhost:3001/api/reviews?product_id=${productID}`)
      .then(responseReviews => {
        axios.get(`http://localhost:3001/api/reviews/meta?product_id=${productID}`)
          .then(responseReviewsMeta => {
            makeReviewsMeta(responseReviewsMeta.data)
            makeReviewsSortedByHelpfulness(sorters.sortReviewsByHelpfulness(responseReviews.data.results));
            makeReviewsSortedByDate(sorters.sortReviewsByDate(responseReviews.data.results));
            let sortedReviewsHelpfulness = sorters.sortReviewsByHelpfulness(responseReviews.data.results);
            let sortedReviewsDate = sorters.sortReviewsByDate(responseReviews.data.results);
            let sortedReviewsRelevance = sorters.relevantReviewSorter(sortedReviewsHelpfulness, sortedReviewsDate);
            makeReviewsSortedByRelevance(sortedReviewsRelevance);
            makeIsPageLoading(false);
          })
          .catch(errorTwo => {
            console.log('errorTwo: ', errorTwo)
          });
      })
      .catch(errorOne => {
        console.log('errorOne: ', errorOne)
      });
  }, [productID])

  // sorting function
  const changeSorting = (value) => {
    if (value.value === 'Newest') {
      makeReviewSorter({value: 'Newest', label: 'Newest'})
    } else if (value.value === 'Helpful') {
      makeReviewSorter({value: 'Helpful', label: 'Helpful'})
    } else {
      makeReviewSorter({value: 'Relevance', label: 'Relevance'})
    }
  }

  const filterFunction = (reviews, reviewFilter) => {
    if (reviewFilter.length === 0) {
      return reviews.filter((element, index) => (
        index < numberOfReviews
      ))
    } else {
      return reviews.filter(review => (
        reviewFilter.includes(review.rating)
      ))
    }
  };


  const options = [
    { value: 'Relevance', label: 'Relevance' },
    { value: 'Helpful', label: 'Helpful' },
    { value: 'Newest', label: 'Newest' }
  ];

  // rendering componenet

  if (isPageloading) {
    return (
      <div>
        Loading... Please Wait
      </div>
    )
  } else if (reviewsSortedByRelevance.length === 0) {
    return (
      <div className='no-review'>
        {<WriteNewReview productName={props.product.name}/>}
      </div>
    )
  } else {
    return (
      <div className='ratings_and_reviews'>
        <div className='section_heading'>
          {'Ratings & Reviews'}
        </div>
        <div className='ratings'>
          <Ratings reviewsMeta={reviewsMeta} reviewFilters={reviewFilters} dispatchReviewFilters={dispatchReviewFilters} key={reviewsMeta.product_id} />
        </div>
        <div className='seperator'></div>
        <div className='reviews'>
          <div className='select_bar'>
            < Select options={options} value={reviewSorter} onChange={value => {changeSorting(value)}} />
          </div>
          <div className='review_tiles'>
            {reviewSorter.value === 'Relevance' ?
              filterFunction(reviewsSortedByRelevance, reviewFilters)
              .map((review, index) => (
                <ReviewTiles review={review} key={index}/>
              )) :
              reviewSorter.value === 'Helpful' ?
                filterFunction(reviewsSortedByHelpfulness, reviewFilters)
                .map((review, index) => (
                  <ReviewTiles review={review} key={index}/>
                )) :
                filterFunction(reviewsSortedByDate, reviewFilters)
                .map((review, index) => (
                  <ReviewTiles review={review} key={index}/>
                ))
            }
          </div>
          <div>
            {reviewsSortedByRelevance.length > numberOfReviews && reviewFilters.length === 0 ?
              <button className="show_more_button functional-btn" onClick={() => makeNumberOfReviews(numberOfReviews + 2)}>Click for more reviews</button> :
              <div></div>
            }
          </div>
          <div>
            {<WriteNewReview productName={props.product.name}/>}
          </div>
        </div>
      </div>
    )
  }
}

export default Reviews;