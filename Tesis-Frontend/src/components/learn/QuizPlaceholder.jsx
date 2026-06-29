import { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";

const QuizCard = ({ quiz }) => {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!quiz) return null;

  const isCorrect = selected === quiz.correctOption;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitted(true);
  };

  const handleRetry = () => {
    setSelected("");
    setSubmitted(false);
  };

  const getOptionStyle = (option) => {
    if (!submitted) return {};
    if (option === quiz.correctOption) {
      return { className: "quiz-option-correct", style: { backgroundColor: "#d4edda", borderColor: "#28a745" } };
    }
    if (option === selected && !isCorrect) {
      return { className: "quiz-option-incorrect", style: { backgroundColor: "#f8d7da", borderColor: "#dc3545" } };
    }
    return { className: "quiz-option-disabled" };
  };

  return (
    <Card className="learn-quiz-card mt-4">
      <Card.Body>
        <h5 className="mb-3">Pregunta de la lección</h5>
        <Form onSubmit={onSubmit}>
          <Form.Label className="fw-semibold">{quiz.question}</Form.Label>
          {quiz.options.map((option) => {
            const { className, style } = getOptionStyle(option);
            return (
              <Form.Check
                key={option}
                type="radio"
                name="lesson-quiz"
                id={`quiz-${option}`}
                label={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                disabled={submitted}
                className={`mb-2 p-2 rounded ${className || ""}`}
                style={{ cursor: submitted ? "default" : "pointer", ...style }}
              />
            );
          })}

          {!submitted && (
            <Button
              type="submit"
              variant="primary"
              size="sm"
              className="mt-2"
              disabled={!selected}
            >
              Enviar respuesta
            </Button>
          )}

          {submitted && (
            <div className="mt-3">
              <div
                className={`p-3 rounded fw-semibold ${
                  isCorrect
                    ? "bg-success-subtle text-success"
                    : "bg-danger-subtle text-danger"
                }`}
              >
                {isCorrect
                  ? "¡Respuesta correcta!"
                  : `Respuesta incorrecta. La respuesta correcta es: ${quiz.correctOption}`}
              </div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="mt-2"
                onClick={handleRetry}
              >
                Reintentar
              </Button>
            </div>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default QuizCard;
