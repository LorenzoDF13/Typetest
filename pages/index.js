import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { allWords } from '../Parole.js';
import { HiRefresh } from 'react-icons/hi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Modal from '../components/Modal.jsx';
let firstTime = true;
let keyPressed = 0;
let clock = null;
let missedCharacter = 0;
export default function Home({ serverSideWords }) {
  const [words, setWords] = useState(serverSideWords);
  const [timer, setTimer] = useState(60);
  const [counterParole, setCounterParole] = useState(0);
  const [paroleSbagliate, setParoleSbagliate] = useState([]);
  const [end, setEnd] = useState(false);
  const wordsRef = useRef();
  const currentWordRef = useRef();
  function refresh() {
    setWords([]);
    fetch('/api/words')
      .then((r) => r.json())
      .then((ws) => setWords(ws));
    keyPressed = 0;
    setParoleSbagliate([]);
    setCounterParole(0);
    setEnd(false);
    firstTime = true;
    setTimer(60);
    missedCharacter = 0;
    clearInterval(clock);
  }
  function startTimer() {
    let secondi = 60;
    clearInterval(clock);
    clock = setInterval(() => {
      setTimer(--secondi);
      if (secondi == 0) {
        setEnd(true);
        clearInterval(clock);
      }
    }, 1000);
  }
  function check(e) {
    keyPressed++;
    if (firstTime) {
      startTimer();
      firstTime = false;
    } /* 
    if (e.target.value.at(e.target.value - length - 1) == ' ')
      setCounterParole(counterParole++); */
    e.target.value = e.target.value.replace(' ', '');
    let text = e.target.value;
    if (text.length > 0) {
      const lastCharacter = text[text.length - 1];
      if (lastCharacter != words[counterParole].at(text.length - 1)) {
        missedCharacter++;
        if (!paroleSbagliate.includes(counterParole)) {
          setParoleSbagliate((pa) => [...pa, counterParole]);
        }
      }
    }
    if (text.length == words[counterParole].length) {
      e.target.value = '';
      setCounterParole(++counterParole);
    }
    if (currentWordRef.current.offsetTop > 107) {
      wordsRef.current.style.transform = `translateY(${
        -107 * (currentWordRef.current.offsetTop / 107) + 'px'
      }`;
    }
  }
  if (!words.length) {
    return (
      <div style={{ maxWidth: '800px', margin: ' 20px auto' }} className="fs-5">
        <Skeleton count={4} height={'100%'} />
      </div>
    );
  }
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Testa la tua velocità di scrittura con questo semplice tool!"
        />
        <title>Testa le tue capacità!</title>
      </Head>
      <Modal
        isOpen={end}
        setIsOpen={setEnd}
        wpm={(keyPressed / 5).toFixed(2)}
        ps={paroleSbagliate.length}
        pa={counterParole - paroleSbagliate.length}
        cd={keyPressed}
        ce={missedCharacter}
        refresh={refresh}
      />
      <div style={{ maxWidth: '800px', margin: ' 20px auto' }}>
        <div className="m-3">
          <div className="d-flex flex-row">
            <div className="form-control ">
              <div
                style={{ maxHeight: '150px', overflow: 'hidden' }}
                className="card-body fs-5 text-center"
              >
                <p ref={wordsRef}>
                  {words.map((word, i) => (
                    <span
                      className="m-1"
                      key={i}
                      ref={i === counterParole ? currentWordRef : null}
                      style={
                        paroleSbagliate.includes(i)
                          ? {
                              // PAROLA SBAGLIATA
                              backgroundColor: 'rgba(255,0,0,0.5)',
                              borderRadius: '3px',
                            }
                          : i == counterParole // PAROLA CORRENTE
                          ? {
                              backgroundColor: '#dee2e6',
                              borderRadius: '3px',
                            }
                          : counterParole > i
                          ? {
                              //PAROLA AZZECCATA
                              backgroundColor: 'rgba(0,255,100,0.5)',
                              borderRadius: '3px',
                            }
                          : {}
                      }
                    >
                      {word}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <p>
              Velocità media:
              {(keyPressed / 5 / ((60 - timer) / 60)).toFixed(2)}
            </p>
            <p>
              accuratezza:
              {' ' +
                (((keyPressed - missedCharacter) * 100) / keyPressed).toFixed(
                  2
                ) +
                '%'}
            </p>
            <p>Parole sbagliate: {paroleSbagliate.length}</p>
          </div>
        </div>

        <div
          className="d-flex flex-row"
          style={{ maxWidth: '600px', margin: '50px auto' }}
        >
          <input
            type="text"
            disabled={end}
            autoComplete={'off'}
            autoCorrect={'off'}
            className="form-control fs-4"
            onChange={check}
            onKeyUp={(e) => {
              if (e.key == 'Backspace') {
                keyPressed -= 2;
              }
            }}
          />
          <div
            className="bg-primary d-flex icon-container   ms-2 px-3 rounded align-items-center"
            onClick={refresh}
          >
            <HiRefresh className="icon" size={30} color="white" />
          </div>
          <div className="clock bg-secondary fs-3  mx-2 p-2 px-3 h-3 text-white rounded">
            {timer}
          </div>
        </div>
      </div>
    </>
  );
}
export function getServerSideProps() {
  const w = [];
  for (var i = 0; i < 100; i++) {
    const r = parseInt(Math.random() * 1000);
    w.push(allWords[r]);
  }
  return { props: { serverSideWords: w } };
}
