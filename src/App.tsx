import './App.css'

function App() {

  return (
    <>
     <div className="chatArea">
       <h1>Code Review</h1>
       <div className="reviewBox">
         <label htmlFor="review" className='reviewLabel'>Код для ревью</label>
         <textarea name="review" id="review"></textarea>
       </div>
       <div className="action-buttons">
         <button className='send'>Отправить</button>
         <button className='runLinter'>Запустить ESLint (mock)</button>
         <button className='runTests'>Запустить Тесты (mock)</button>
       </div>
       <div className="assistantResponse">
         <div className="answer">
           <label htmlFor='answer' className='answerLabel'>Ответ ассистента</label>
           <textarea name="answer" id="answer"></textarea>
         </div>
         <div className="additional-tests">
         <div className="es-mock-box">
           <label htmlFor='es-mock' className='es-mock-label'>ESLint (mock)</label>
           <textarea name="es-mock" id="es-mock"></textarea>
         </div>
         <div className="tests-mock-box">
           <label htmlFor='test-mock' className='test-mock-label'>Tests (mock)</label>
           <textarea name="test-mock" id="test-mock"></textarea>
         </div>
       </div>
       </div>
     </div>
    </>
  )
}

export default App
