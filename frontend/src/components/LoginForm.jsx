import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaKey
} from 'react-icons/fa';
import { useSpring, animated as Animated } from '@react-spring/web';
import { login } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/notificationSlice';
import loginImage from '/login-image.svg';
import '../styles/Login.css';

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize particles.js
    if (window.particlesJS) {
      window.particlesJS('particles-js', {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#004030' },
          shape: { type: 'circle' },
          opacity: { value: 0.5, random: true },
          size: { value: 3, random: true },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#004030',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          }
        },
        retina_detect: true
      });
    }
  }, []);

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

  const isSmallScreen = window.innerWidth <= 425;

  const validateForm = () => {
    const { email, password } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!email.trim()) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Email required' : 'Email is required',
        type: 'error'
      }));
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid email format' : 'Please enter a valid email address (e.g., name@example.com)',
        type: 'error'
      }));
      return false;
    }

    if (!password.trim()) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Password required' : 'Password is required',
        type: 'error'
      }));
      return false;
    }

    if (!passwordRegex.test(password.trim())) {
      dispatch(showNotification({
        message: isSmallScreen
          ? 'Weak password'
          : 'Key must be 8+ chars (upper,lowercase,number,special char)',
        type: 'error'
      }));
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await dispatch(login(formData)).unwrap();
      dispatch(showNotification({
        message: 'Logged in successfully!',
        type: 'success'
      }));
      navigate('/home');
    } catch (error) {
      const msg = error.message || 'Login failed';
      console.log('Login error message:', msg);

      if (msg === 'Email not found') {
        dispatch(showNotification({
          message: isSmallScreen ? 'Email not found' : 'Email not found. Login failed.',
          type: 'error'
        }));
      } else if (msg === 'Password incorrect') {
        dispatch(showNotification({
          message: isSmallScreen ? 'Password incorrect' : 'Password is incorrect. Login failed.',
          type: 'error'
        }));
      } else {
        dispatch(showNotification({
          message: isSmallScreen ? 'Login failed' : msg || 'Login failed. Please try again.',
          type: 'error'
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="login-container">
      <div id="particles-js" className="particles-bg"></div>
      <Animated.div style={cardAnimation} className="project-card">
        <div className="project-ribbon">
          <FaLock className="ribbon-icon me-2" />Login
        </div>
        <Animated.div style={fadeIn} className="project-content">
          <div className="welcome-text text-center mb-3">
            <h3>Welcome Back</h3>
            <p>Sign in to continue your journey</p>
          </div>
          <img
            src={loginImage}
            alt="Login illustration"
            className="login-image img-fluid mb-0"
          />
          <hr className="animated-hr" />
          <Form className="contact-form">
            <Form.Group className="display-flex flex-column mb-3 form-group-with-icon" controlId="formEmail">
              <div className="form-label-with-icon">
                <FaEnvelope className="form-icon" />
                <Form.Label className="form-label">Email</Form.Label>
              </div>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 form-group-with-icon position-relative" controlId="formPassword">
              <div className="form-label-with-icon">
                <FaLock className="form-icon" />
                <Form.Label className="form-label">Password</Form.Label>
              </div>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle-icon"
                style={{ marginTop: '14px', marginRight: '5px' }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>

            <p className="form-link text-end">
              <Link to="/reset-password" style={{ color: '#004030' }}>
                Forgot Password?
              </Link>
            </p>

            <Button
              variant="light"
              className="submit-btn border-0 rounded-0"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner-icon" /> Logging In...
                </>
              ) : (
                <>
                  <FaKey className="me-2" />Login
                </>
              )}
            </Button>

            <p className="form-link">
              Don't have an account?{' '}
              <Link
                to="/signup"
                style={{
                  color: '#004030',
                  textDecoration: 'underline',
                  fontWeight: 'bolder',
                  textUnderlineOffset: '3px',
                }}
              >
                Sign Up
              </Link>
            </p>
          </Form>
        </Animated.div>
      </Animated.div>
    </Container>
  );
}