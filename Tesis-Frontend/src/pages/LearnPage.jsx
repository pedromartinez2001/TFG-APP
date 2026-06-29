import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopicCard from "../components/learn/TopicCard";
import LearnProgressBar from "../components/learn/ProgressBar";
import { getTotalLessons, learnTopics } from "../data/learnLessons";
import { getLearnProgress } from "../utils/learnProgress";
import "../components/learn/learn.css";

const LearnPage = () => {
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    setProgressMap(getLearnProgress());
  }, []);

  const completedCount = Object.values(progressMap).filter(Boolean).length;
  const totalLessons = getTotalLessons();

  return (
    <Container className="learn-container">
      <header className="learn-header">
        <h1>Aprender</h1>
        <p>Explora por temas y avanza en sus lecciones internas.</p>
      </header>

      <LearnProgressBar completed={completedCount} total={totalLessons} />

      <Row className="g-3 mt-1">
        {learnTopics.map((topic) => (
          <Col key={topic.id} xs={12} md={6} lg={4}>
            <TopicCard
              topic={topic}
              completedLessons={
                topic.lessons.filter(
                  (lesson) => progressMap[`${topic.id}:${lesson.id}`],
                ).length
              }
              totalLessons={topic.lessons.length}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LearnPage;
