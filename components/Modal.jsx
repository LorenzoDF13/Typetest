import React from 'react';
import M from 'react-modal';
import { HiRefresh } from 'react-icons/hi';
function Modal({ isOpen, setIsOpen, wpm, ps, pa, cd, refresh, ce }) {
  return (
    <M
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      style={{
        overlay: {
          position: 'fixed',
          width: '100vw',
          heigth: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
          position: 'absolute',
          animation: 'fade 1s forwards',
          width: '300px',
          left: '50%',
        },
      }}
    >
      <p className="resultsP">Parole per minuto:</p>
      <span style={{ fontSize: '30px' }} className=" text-success ">
        {wpm}
      </span>
      <p className="resultsP">Accuratezza:</p>
      <span className="fs-3 text-primary">{((cd - ce) * 100) / cd}%</span>
      <p className="resultsP">Parole sbagliate:</p>
      <span className="fs-3 text-danger">{ps}</span>
      <p className="resultsP">Parole corrette:</p>
      <span className="fs-3 text-success">{pa}</span>
      <p className="resultsP">Caratteri digitati:</p>
      <span className="fs-3 text-primary">{cd}</span>
      <p className="resultsP">Caratteri corretti:</p>
      <span className="fs-3 text-success">{cd - ce}</span>
      <p className="resultsP">Caratteri sbagliati:</p>
      <span className="fs-3 text-danger">{ce}</span>
      <div
        style={{ width: 'fit-content', boxShadow: '0 0 30px #0d6efd ' }}
        className="bg-primary rounded text-white icon-container p-3 mt-5 w mx-auto"
        onClick={refresh}
      >
        <HiRefresh className="icon" size={30} />
      </div>
    </M>
  );
}

export default Modal;
