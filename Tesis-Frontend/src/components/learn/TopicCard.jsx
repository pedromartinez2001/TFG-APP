import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const TopicCard = ({ topic, completedLessons, totalLessons }) => {
  return (
    <Card className="learn-card h-100">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-2 gap-2">
          <Card.Title className="learn-card-title mb-0">
            {topic.title}
          </Card.Title>
          <Badge
            bg="primary-subtle"
            text="primary"
            className="learn-topic-badge"
          >
            {totalLessons} lecciones
          </Badge>
        </div>

        <Card.Text className="learn-card-desc">{topic.description}</Card.Text>

        <small className="learn-topic-progress mb-3">
          Progreso del tema: {completedLessons}/{totalLessons}
        </small>

        <Button
          as={Link}
          to={`/aprender/${topic.id}`}
          variant="primary"
          size="sm"
          className="mt-auto"
        >
          Ver tema
        </Button>
      </Card.Body>
    </Card>
  );
};

export default TopicCard;
