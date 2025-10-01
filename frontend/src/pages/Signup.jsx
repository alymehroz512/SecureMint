import { Container } from 'react-bootstrap';
import SignupForm from '../components/SignupForm';
import '../styles/Signup.css';

export default function Signup() {
  return (
    <div className="auth-wrapper">
      <Container>
        <SignupForm />
      </Container>
    </div>
  );
}