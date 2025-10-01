import { useSpring, animated as Animated } from 'react-spring';
import '../styles/Welcome.css';
import { FaHandsHelping } from 'react-icons/fa';


export default function Welcome({ firstName, lastName }) {
  const fadeIn = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    delay: 300,
  });

  const cardAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 220, friction: 20 },
    delay: 500,
  });

  return (
    <Animated.div style={cardAnimation} className="project-card glass-bg">
      <div className="project-ribbon">
        <FaHandsHelping className='ribbon-icon me-2'/>Welcome
        </div>
      <Animated.div style={fadeIn} className="project-content">
        <h3 className="section-heading">Welcome, {firstName} {lastName}!</h3>
        <p className="section-text">Thank you for joining SecureMint.</p>
      </Animated.div>
    </Animated.div>
  );
}