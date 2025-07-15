import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useSpring, animated as Animated } from 'react-spring';
import { hideNotification } from '../redux/slices/notificationSlice';
import '../styles/Notification.css';

export default function Notification() {
  const dispatch = useDispatch();
  const { message, type, isVisible } = useSelector((state) => state.notification);

  const slideIn = useSpring({
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateX(0)' : 'translateX(100%)' },
    config: { tension: 220, friction: 20 },
  });

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, dispatch]);

  if (!isVisible) return null;

  return (
    <Animated.div style={slideIn} className={`notification ${type}`}>
      <div className="notification-content">
        {type === 'success' ? (
          <FaCheckCircle className="notify-icon" />
        ) : (
          <FaExclamationCircle className="notify-icon" />
        )}
        <span>{message}</span>
      </div>
    </Animated.div>
  );
}