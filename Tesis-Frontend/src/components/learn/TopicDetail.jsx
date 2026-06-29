import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import LearnProgressBar from "./ProgressBar";
import LessonCard from "./LessonCard";
import { learnTopics, getTotalLessons } from "../../data/learnLessons";
import {
  getLearnProgress,
  toggleLessonCompletion,
} from "../../utils/learnProgress";
import "./learn.css";

const TopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    setProgressMap(getLearnProgress());
  }, []);

  const topic = useMemo(
    () => learnTopics.find((item) => item.id === topicId),
    [topicId],
  );

  const totalLessons = getTotalLessons();
  const completedCount = Object.values(progressMap).filter(Boolean).length;

  const onToggleComplete = (topicLessonKey) => {
    const next = toggleLessonCompletion(topicLessonKey);
    setProgressMap(next);
  };

  if (!topic) {
    return (
      <Container className="learn-container">
        <Card className="learn-card">
          <Card.Body>
            <h3>Tema no encontrado</h3>
            <p>Este espacio está preparado para temas y lecciones futuras.</p>
            <Button
              variant="outline-primary"
              onClick={() => navigate("/aprender")}
            >
              Volver a Aprender
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="learn-container">
      <Button
        variant="link"
        className="px-0 mb-2"
        onClick={() => navigate("/aprender")}
      >
        ← Volver a Temas
      </Button>

      <LearnProgressBar completed={completedCount} total={totalLessons} />

      <Card className="learn-card mt-3">
        <Card.Body>
          <h2 className="mb-2">{topic.title}</h2>
          <p className="learn-card-desc mb-1">{topic.description}</p>
          <p className="learn-topic-intro">{topic.content}</p>
        </Card.Body>
      </Card>

      <h4 className="mt-4 mb-3">Lecciones de este tema</h4>
      <Row className="g-3">
        {topic.lessons.map((lesson) => {
          const topicLessonKey = `${topic.id}:${lesson.id}`;
          return (
            <Col key={lesson.id} xs={12} md={6}>
              <LessonCard
                topicId={topic.id}
                lesson={lesson}
                isCompleted={Boolean(progressMap[topicLessonKey])}
                onToggleComplete={onToggleComplete}
              />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default TopicDetail;
