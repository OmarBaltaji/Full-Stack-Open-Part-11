const Notification = ({ message, className }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={'feedback ' + className}>
      {message}
    </div>
  );
}

export default Notification;