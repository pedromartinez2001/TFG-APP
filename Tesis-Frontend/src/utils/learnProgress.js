const LEARN_PROGRESS_KEY = "learn-progress";

export const getLearnProgress = () => {
  try {
    const raw = localStorage.getItem(LEARN_PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveLearnProgress = (progressMap) => {
  localStorage.setItem(LEARN_PROGRESS_KEY, JSON.stringify(progressMap));
};

export const toggleLessonCompletion = (lessonId) => {
  const current = getLearnProgress();
  const next = {
    ...current,
    [lessonId]: !current[lessonId],
  };
  saveLearnProgress(next);
  return next;
};
