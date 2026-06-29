import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import LearnProgressBar from "./ProgressBar";
import QuizCard from "./QuizPlaceholder";
import { getTotalLessons, learnTopics } from "../../data/learnLessons";
import {
  getLearnProgress,
  toggleLessonCompletion,
} from "../../utils/learnProgress";
import "./learn.css";

const LessonDetail = () => {
  const { topicId, lessonId } = useParams();
  const navigate = useNavigate();
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    setProgressMap(getLearnProgress());
  }, []);

  const topic = useMemo(
    () => learnTopics.find((item) => item.id === topicId),
    [topicId],
  );

  const lesson = useMemo(() => {
    if (!topic) return null;
    return topic.lessons.find((item) => item.id === lessonId) || null;
  }, [topic, lessonId]);

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalLessons = getTotalLessons();
  const topicLessonKey = `${topicId}:${lessonId}`;

  if (!lesson) {
    return (
      <Container className="learn-container">
        <Card className="learn-card">
          <Card.Body>
            <h3>Lección no encontrada</h3>
            <p>Este detalle es un placeholder para futuras lecciones.</p>
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

  const isCompleted = Boolean(progressMap[topicLessonKey]);

  const onToggleComplete = () => {
    const next = toggleLessonCompletion(topicLessonKey);
    setProgressMap(next);
  };

  return (
    <Container className="learn-container">
      <Button
        variant="link"
        className="px-0 mb-2"
        onClick={() => navigate(`/aprender/${topicId}`)}
      >
        ← Volver al tema
      </Button>

      <LearnProgressBar completed={completedCount} total={totalLessons} />

      <Card className="learn-card mt-3">
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <h2 className="mb-0">{lesson.title}</h2>
            <Button
              variant={isCompleted ? "success" : "outline-success"}
              size="sm"
              onClick={onToggleComplete}
            >
              {isCompleted ? "Completada" : "Marcar completada"}
            </Button>
          </div>

          <p className="learn-topic-progress mt-2 mb-0">Tema: {topic?.title}</p>

          <p className="learn-card-desc mt-3">{lesson.description}</p>

          <div className="learn-content-block">
            {lesson.content.split('\n\n').filter(Boolean).map((paragraph, i) => (
              <p key={i} className="learn-paragraph">{paragraph}</p>
            ))}
          </div>

          <QuizCard quiz={lesson.quiz} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LessonDetail;
