import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const LessonCard = ({ topicId, lesson, isCompleted, onToggleComplete }) => {
  const topicLessonKey = `${topicId}:${lesson.id}`;

  return (
    <Card className="learn-card h-100">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="learn-card-title">{lesson.title}</Card.Title>
        <Card.Text className="learn-card-desc">{lesson.description}</Card.Text>

        <div className="d-flex gap-2 mt-auto flex-wrap">
          <Button
            as={Link}
            to={`/aprender/${topicId}/${lesson.id}`}
            variant="primary"
            size="sm"
          >
            Ver más
          </Button>
          <Button
            variant={isCompleted ? "success" : "outline-success"}
            size="sm"
            onClick={() => onToggleComplete(topicLessonKey)}
          >
            {isCompleted ? "Completada" : "Marcar completada"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LessonCard;
