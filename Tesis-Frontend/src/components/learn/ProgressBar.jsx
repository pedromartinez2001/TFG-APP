import ProgressBar from "react-bootstrap/ProgressBar";

const LearnProgressBar = ({ completed, total }) => {
  const safeTotal = total || 1;
  const percentage = Math.round((completed / safeTotal) * 100);

  return (
    <div className="learn-progress-wrap">
      <div className="learn-progress-head">
        <span>Progreso</span>
        <strong>
          {completed}/{total} completadas
        </strong>
      </div>
      <ProgressBar
        now={percentage}
        label={`${percentage}%`}
        className="learn-progress"
      />
    </div>
  );
};

export default LearnProgressBar;
