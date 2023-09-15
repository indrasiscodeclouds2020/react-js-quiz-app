import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currQuestion, setCurrQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false); // Add a state for quiz completion

  useEffect(() => {
    // Fetch questions from your API here
    fetch('http://localhost/quiz.php')
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching questions:', error);
        setLoading(false);
      });
  }, []);

  const loadQuestion = () => {
    if (loading) {
      return <div>Loading questions...</div>;
    }

    if (questions.length === 0) {
      return <div>No questions available</div>;
    }

    const question = questions[currQuestion];
    return (
      <div>
        <h2>{question.q}</h2>
        <div>
          {question.a.map((answer, index) => (
            <div key={index}>
              <input
                type="radio"
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={handleOptionChange}
              />
              {answer.text}
            </div>
          ))}
        </div>
        <button onClick={checkAnswer}>Submit</button>
      </div>
    );
  };

  const handleOptionChange = (e) => {
    setSelectedAnswer(parseInt(e.target.value));
  };

  const checkAnswer = () => {
    const question = questions[currQuestion];
    if (question.a[selectedAnswer]?.isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currQuestion < questions.length - 1) {
      setCurrQuestion((prevQuestion) => prevQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Handle quiz completion logic here
      console.log('Quiz completed!');
      setQuizCompleted(true); // Trigger a state change for quiz completion
    }
  };

  return (
    <div className="panel">
      <h1>Quiz Application</h1>
      {quizCompleted ? ( // Use the quizCompleted state to conditionally render the message
        <div>
          <h2>Quiz completed!</h2>
          <h2>Your Score: {score}</h2>
        </div>
      ) : (
        loadQuestion()
      )}
    </div>
  );
}

export default App;
