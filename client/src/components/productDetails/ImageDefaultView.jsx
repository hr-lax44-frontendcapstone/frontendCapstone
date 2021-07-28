import React, { useState } from 'react';
import SwiperCore, { Navigation, Thumbs } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

export default function ImageDefaultView(props) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  SwiperCore.use([Navigation, Thumbs]);

  return (
    <div id='col_image'>
      <Swiper
        spaceBetween={500}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        className="mySwiper2"
        observer
      >
        {props.imageArray.map((image, index) =>
          <SwiperSlide key={index} tag='li'>
            <img id='main_image' key={index} src={image.url} />
          </SwiperSlide>
        )}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={5}
        slidesPerView={5}
        navigation={true}
        freeMode={true}
        watchSlidesVisibility={true}
        watchSlidesProgress={true}
        className="mySwiper"
      >
        {props.imageArray.map((image, index) =>
          <SwiperSlide key={index}>
            <img className='sub_images' key={index} src={image.thumbnail_url} onClick={() => props.handleImageClick(index)} />
          </SwiperSlide>)}
      </Swiper>
    </div>
  )
}