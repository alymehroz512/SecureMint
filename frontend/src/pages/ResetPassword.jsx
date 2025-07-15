import { Container } from 'react-bootstrap';
import ResetPasswordForm from '../components/ResetPasswordForm';
import '../styles/ResetPassword.css';

export default function ResetPassword() {
  return (
    <div className="auth-wrapper">
      <Container>
        <ResetPasswordForm />
      </Container>
    </div>
  );
}