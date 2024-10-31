import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../connection/connection';
// import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [resetError, setResetError] = useState('');

  // const navigate = useNavigate();

  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful', user.uid);
      // navigate('/Product');
    } catch (error) {
      const errorMessage =
        error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found'
          ? 'Invalid email or password'
          : 'Login failed. Please try again.';
      setLoginError(errorMessage);
      console.log("Login error:", error.message);
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setResetError('');
    setResetEmailSent(false);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetEmailSent(true);
      console.log("Password reset email sent to:", resetEmail);
    } catch (error) {
      setResetError('Failed to send reset email. Please check the email and try again.');
      console.log("Error sending reset email:", error.message);
    }
  };

  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setResetError(''); // Clear any previous errors
    setResetEmailSent(false); // Reset email sent status
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg text-text">
      <div className="bg-secondary p-6 rounded-lg shadow-md w-96">
        <div className="logo mb-4">
          <img src="https://mindrontech.in/wp-content/uploads/2023/02/cropped-mindron-logo-1.png" alt="mindron" className="mx-auto" />
        </div>
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl mb-2">Sign in to your Dashboard</h2>
          <small className="block mb-4 text-secondary-text-color">Create interactive catalogs, AR visualizations, and more.</small>

          {loginError && <span className="error text-error-text-color">{loginError}</span>}

          <div className="inputGroup mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
            
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
              className="w-full p-2 border border-border-color rounded text-text-black"
            />
          </div>

          <div className="inputGroup mb-4">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              required
              className="w-full p-2 border border-border-color rounded text-text-black"
            />
          </div>

          <div className="reset-container mb-4">
            <button type="button" className="linkButton text-link hover:text-link-hover-color" onClick={toggleResetForm}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="primary-button bg-button hover:bg-button-hover text-button-text-color w-full p-2 rounded">Sign in</button>

        </form>

        {showResetForm && (
          <form onSubmit={handlePasswordReset} className="reset-form mt-4">
            <h3 className="text-lg mb-2">Reset Password</h3>
            {resetEmailSent && <span className="success text-success-text-color">Password reset email sent!</span>}
            {resetError && <span className="error text-error-text-color">{resetError}</span>}
            <div className="inputGroup mb-4">
              <label htmlFor="resetEmail" className="block mb-1">Enter your email</label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email for password reset"
                required
                className="w-full p-2 border border-border-color rounded text-text-black"
              />
            </div>
            <button type="submit" className="primary-button bg-button hover:bg-button-hover text-button-text-color w-full p-2 rounded">Send Reset Email</button>
            <button type="button" className="linkButton text-link hover:text-link-hover-color w-full mt-2" onClick={toggleResetForm}>
              Cancel
            </button>
          </form>
        )}
      </div>

      <div className="image-container">
        <img src="" alt="image" />
      </div>
    </div>
  );
};

export default Login;
