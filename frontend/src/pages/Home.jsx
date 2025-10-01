import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import { useSpring, animated as Animated } from "react-spring";
import { fetchUser, logoutUser, refreshToken } from "../redux/slices/authSlice";
import { showNotification } from "../redux/slices/notificationSlice";
import Welcome from "../components/Welcome";
import "../styles/Home.css";
import { AiFillHome } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.auth);

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    delay: 300,
  });

  useEffect(() => {
    if (!user && status === "idle") {
      dispatch(fetchUser());
    } else if (status === "failed" && error === "TOKEN_EXPIRED") {
      // Try to refresh token
      dispatch(refreshToken());
    }
  }, [user, status, error, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(
        showNotification({
          message: "Logged out successfully!",
          type: "success",
        })
      );
      navigate("/login", { replace: true });
    } catch (error) {
      dispatch(
        showNotification({
          message: "Logout failed: " + error.message,
          type: "error",
        })
      );
    }
  };

  if (status === "loading") {
    return (
      <Container className="home-container">
        <Animated.div style={fadeIn} className="project-card glass-bg">
          <div className="project-ribbon">Loading</div>
          <Animated.div style={fadeIn} className="project-content">
            <p className="section-text">Loading...</p>
          </Animated.div>
        </Animated.div>
      </Container>
    );
  }

  if (status === "failed" || !user) {
    return (
      <Container className="home-container">
        <Animated.div style={fadeIn} className="project-card glass-bg">
          <div className="project-ribbon">Error</div>
          <Animated.div style={fadeIn} className="project-content">
            <h3 className="section-heading">Error</h3>
            <p className="section-text">
              {error || "Failed to load user data"}
            </p>
            <Button
              variant="light"
              className="submit-btn border-0 rounded-0"
              onClick={handleLogout}
              aria-label="Go to Login"
            >
              Go to Login
            </Button>
          </Animated.div>
        </Animated.div>
      </Container>
    );
  }

  return (
    <Container className="home-container">
      <Animated.div style={fadeIn} className="project-card glass-bg">
        <div className="project-ribbon">
          <AiFillHome className="ribbon-icon me-2" />Home
        </div>

        <Animated.div style={fadeIn} className="project-content">
          <Welcome firstName={user.firstName} lastName={user.lastName} />
          <Button
            variant="light"
            className="submit-btn border-0 rounded-0"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <FiLogOut className="me-2" />Logout
          </Button>
        </Animated.div>
      </Animated.div>
    </Container>
  );
}
