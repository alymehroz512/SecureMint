import { Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';
import '../styles/Login.css';

export default function Login() {
  return (
    <div className="auth-wrapper">
      <Container>
        <LoginForm />
      </Container>
    </div>
  );
}