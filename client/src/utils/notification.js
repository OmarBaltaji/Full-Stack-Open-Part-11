export const notify = (message, setFeedback, type = 'success') => {
  setFeedback({ message, type });
  setTimeout(() => setFeedback({ message: null, type: '' }), 5000);
};
