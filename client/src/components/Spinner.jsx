import React from 'react';

const Spinner = () => {
  return (
    <>
      <div className="spinner"></div>
      <style>
        {`
          .spinner {
            width: 36px;
            height: 36px;
            display: grid;
            border: 4.5px solid transparent;
            border-radius: 50%;
            border-right-color: #00684a;
            animation: spinner-a4dj62 1s infinite linear;
          }

          .spinner::before,
          .spinner::after {
            content: "";
            grid-area: 1/1;
            margin: 2.2px;
            border: inherit;
            border-radius: 50%;
            animation: spinner-a4dj62 2s infinite;
          }

          .spinner::after {
            margin: 8.9px;
            animation-duration: 3s;
          }

          @keyframes spinner-a4dj62 {
            100% {
              transform: rotate(1turn);
            }
          }
        `}
      </style>
    </>
  );
};

export default Spinner;
