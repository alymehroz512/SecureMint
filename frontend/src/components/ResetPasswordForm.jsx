import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaKey,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaPaperPlane,
  FaCheck,
  FaUndo,
} from 'react-icons/fa';
import { useSpring, animated as Animated } from '@react-spring/web';
import { sendOtp, verifyOtp, resetPassword } from '../redux/slices/authSlice';
import { showNotification } from '../redux/slices/notificationSlice';
import resetKeyImage from '/reset-password-image.svg';
import otpImage from '/otp-image.svg';
import newKeyImage from '/new-password-image.svg';
import '../styles/ResetPassword.css';

export default function ResetPasswordForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
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

  const validateEmail = () => {
    const { email } = formData;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu)$/;

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

    return true;
  };

  const validateOtp = () => {
    const { otp } = formData;
    const otpRegex = /^\d{6}$/;

    if (!otp.trim()) {
      dispatch(showNotification({
        message: isSmallScreen ? 'OTP required' : 'OTP is required',
        type: 'error'
      }));
      return false;
    }

    if (!otpRegex.test(otp.trim())) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid OTP' : 'OTP must be a 6-digit number',
        type: 'error'
      }));
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!newPassword.trim()) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Password required' : 'New password is required',
        type: 'error'
      }));
      return false;
    }

    if (!passwordRegex.test(newPassword.trim())) {
      dispatch(showNotification({
        message: isSmallScreen
          ? 'Weak password'
          : 'Key must be 8+ chars (upper,lowercase,number,special char)',
        type: 'error'
      }));
      return false;
    }

    if (newPassword !== confirmPassword) {
      dispatch(showNotification({
        message: isSmallScreen ? 'Passwords don’t match' : 'Passwords do not match',
        type: 'error'
      }));
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!validateEmail()) return;
    setIsSubmitting(true);
    try {
      await dispatch(sendOtp(formData.email)).unwrap();
      dispatch(showNotification({
        message: isSmallScreen ? 'OTP sent' : 'OTP sent successfully!',
        type: 'success'
      }));
      setStep(2);
    } catch (error) {
      const msg = error.message || 'Failed to send OTP';
      dispatch(showNotification({
        message: isSmallScreen
          ? msg === 'Email not found' ? 'Email not found' : 'OTP send failed'
          : msg === 'Email not found' ? 'Email not found. Please check or sign up.' : 'Failed to send OTP. Please try again.',
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!validateOtp()) return;
    setIsSubmitting(true);
    try {
      await dispatch(verifyOtp({ email: formData.email, otp: formData.otp })).unwrap();
      dispatch(showNotification({
        message: isSmallScreen ? 'OTP verified' : 'OTP verified successfully!',
        type: 'success'
      }));
      setStep(3);
    } catch (error) {
      const msg = error.message || 'OTP verification failed';
      dispatch(showNotification({
        message: isSmallScreen ? 'Invalid OTP' : msg,
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        resetPassword({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword,
        })
      ).unwrap();
      dispatch(showNotification({
        message: isSmallScreen ? 'Password reset' : 'Password reset successfully!',
        type: 'success'
      }));
      navigate('/login');
    } catch (error) {
      const msg = error.message || 'Password reset failed';
      dispatch(showNotification({
        message: isSmallScreen ? 'Reset failed' : msg,
        type: 'error'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderButtonContent = (icon, text, loadingText) => (
    <>
      {isSubmitting ? (
        <>
          <FaSpinner className="spinner-icon me-2" />
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          <span className="ms-2">{text}</span>
        </>
      )}
    </>
  );

  return (
    <Container className="reset-password-container">
      <div id="particles-js" className="particles-bg"></div>
      <Animated.div style={cardAnimation} className="project-card">
        <div className="project-ribbon">
          <FaKey className="ribbon-icon me-2" />
          {step === 1 ? 'Reset Password' : step === 2 ? 'Verify OTP' : 'Set New Password'}
        </div>
        <Animated.div style={fadeIn} className="project-content">
          <div className="welcome-text text-center mb-3">
            {step === 1 && (
              <>
                <h3>Reset Your Password</h3>
                <p>Enter your email to receive an OTP</p>
              </>
            )}
            {step === 2 && (
              <>
                <h3>Verify OTP</h3>
                <p>Enter the 6-digit OTP sent to your email</p>
              </>
            )}
            {step === 3 && (
              <>
                <h3>Set New Password</h3>
                <p>Create a new secure password</p>
              </>
            )}
          </div>
          <img
            src={step === 1 ? resetKeyImage : step === 2 ? otpImage : newKeyImage}
            alt={step === 1 ? 'Reset Password illustration' : step === 2 ? 'OTP illustration' : 'New Password illustration'}
            className="login-image img-fluid mb-0"
          />
          <hr className="animated-hr" />
          {step === 1 && (
            <Form className="contact-form">
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
              <Button
                variant="light"
                className="submit-btn border-0 rounded-0"
                onClick={handleSendOtp}
                disabled={isSubmitting}
              >
                {renderButtonContent(<FaPaperPlane />, 'Send OTP', 'Sending OTP...')}
              </Button>
              <p className="form-link">
                Back to <Link to="/login" style={{ color: '#004030', textDecoration: 'underline', fontWeight: 'bolder', textUnderlineOffset: '3px' }}>Login</Link>
              </p>
            </Form>
          )}
          {step === 2 && (
            <Form className="contact-form">
              <Form.Group className="mb-3 form-group-with-icon" controlId="formOtp">
                <div className="form-label-with-icon">
                  <FaKey className="form-icon" />
                  <Form.Label className="form-label">OTP</Form.Label>
                </div>
                <Form.Control
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Button
                variant="light"
                className="submit-btn border-0 rounded-0"
                onClick={handleVerifyOtp}
                disabled={isSubmitting}
              >
                {renderButtonContent(<FaCheck />, 'Verify OTP', 'Verifying...')}
              </Button>
              <p className="form-link">
                Back to <Link to="/login" style={{ color: '#004030', textDecoration: 'underline', fontWeight: 'bolder', textUnderlineOffset: '3px' }}>Login</Link>
              </p>
            </Form>
          )}
          {step === 3 && (
            <Form className="contact-form">
              <Form.Group className="mb-3 form-group-with-icon position-relative" controlId="formNewPassword">
                <div className="form-label-with-icon">
                  <FaLock className="form-icon" />
                  <Form.Label className="form-label">New Password</Form.Label>
                </div>
                <Form.Control
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <span
                  className="password-toggle-icon"
                  style={{ marginTop: '14px', marginRight: '5px' }}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
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
                  placeholder="Confirm new password"
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
                onClick={handleResetPassword}
                disabled={isSubmitting}
              >
                {renderButtonContent(<FaUndo />, 'Reset Password', 'Resetting...')}
              </Button>
              <p className="form-link">
                Back to <Link to="/login" style={{ color: '#004030', textDecoration: 'underline', fontWeight: 'bolder', textUnderlineOffset: '3px' }}>Login</Link>
              </p>
            </Form>
          )}
        </Animated.div>
      </Animated.div>
    </Container>
  );
}