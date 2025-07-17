import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaSpinner, FaUserPlus, FaTag
} from 'react-icons/fa';
import { useSpring, animated as Animated } from '@react-spring/web';
import { register } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/notificationSlice';
import signUpImage from '/sigin-image.svg';
import '../styles/Signup.css';

export default function SignupForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const nameRegex = /^[A-Za-z\s]{2,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.firstName || !nameRegex.test(formData.firstName)) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid first name' : 'First name must be 2 letters and only contain letters/spaces',
        type: 'error'
      }));
      return false;
    }

    if (!formData.lastName || !nameRegex.test(formData.lastName)) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid last name' : 'Last name must be 2 letters and only contain letters/spaces',
        type: 'error'
      }));
      return false;
    }

    if (!formData.email || !emailRegex.test(formData.email)) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid email format' : 'Please enter a valid email address (e.g., name@example.com)',
        type: 'error'
      }));
      return false;
    }

    if (!formData.password || !passwordRegex.test(formData.password)) {
      dispatch(showNotification({
        message: isSmallScreen
          ? 'Weak password'
          : 'Key must be 8+ chars (upper,lowercase,number,special char)',
        type: 'error'
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Passwords mismatch' : 'Passwords do not match',
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
      await dispatch(register(formData)).unwrap();
      dispatch(showNotification({ message: 'User registered successfully!', type: 'success' }));
      navigate('/login');
    } catch (error) {
      dispatch(showNotification({ message: error.message, type: 'error' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="signup-container">
      <div id="particles-js" className="particles-bg"></div>
      <Animated.div style={cardAnimation} className="project-card">
        <div className="project-ribbon">
          <FaTag className="ribbon-icon me-2" />Sign Up
        </div>
        <Animated.div style={fadeIn} className="project-content">
          <div className="welcome-text text-center mb-3">
            <h3>Join Us Today</h3>
            <p>Create your account to start your journey</p>
          </div>
          <img
            src={signUpImage}
            alt="Signup illustration"
            className="login-image img-fluid mb-0"
          />
          <hr className="animated-hr" />
          <Form className="contact-form">
            <Form.Group className="mb-3 form-group-with-icon" controlId="formFirstName">
              <div className="form-label-with-icon">
                <FaUser className="form-icon" />
                <Form.Label className="form-label">First Name</Form.Label>
              </div>
              <Form.Control
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 form-group-with-icon" controlId="formLastName">
              <div className="form-label-with-icon">
                <FaUser className="form-icon" />
                <Form.Label className="form-label">Last Name</Form.Label>
              </div>
              <Form.Control
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 form-group-with-icon" controlId="formEmail">
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

            <Form.Group className="mb-3 form-group-with-icon position-relative" controlId="formConfirmPassword">
              <div className="form-label-with-icon">
                <FaLock className="form-icon" />
                <Form.Label className="form-label">Confirm Password</Form.Label>
              </div>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                className="password-toggle-icon"
                style={{ marginTop: '14px', marginRight: '5px' }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </Form.Group>

            <Button
              variant="light"
              className="submit-btn border-0 rounded-0"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner-icon me-2" /> Signing Up...
                </>
              ) : (
                <>
                  <FaUserPlus className="me-2" /> Sign Up
                </>
              )}
            </Button>

            <p className="form-link">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: '#004030',
                  textDecoration: 'underline',
                  fontWeight: 'bolder',
                  textUnderlineOffset: '3px',
                }}
              >
                Login
              </Link>
            </p>
          </Form>
        </Animated.div>
      </Animated.div>
    </Container>
  );
}