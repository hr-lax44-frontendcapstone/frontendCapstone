import React from 'react';

const AboutUsModal = ({handleClose, show, children}) => {
  const showHideClassName = show ? 'modal_open' : 'modal_closed';

  return (
    <div className={showHideClassName}>
      <div className='modal_container'>
        {children}
        <a className='modal-close' onClick={handleClose}>close
        </a>
      </div>
    </div>
  )
}

export default AboutUsModal;