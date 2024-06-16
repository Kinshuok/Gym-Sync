import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import validation from "./LoginValidation";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      navigate("/");
    }
  }
  , []);

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoadingExercises(true);
      const response = await fetch("https://gymance-y7ux.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        const responseData = await response.json();
        const { username } = responseData;
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setErrorMessage("Incorrect email or password");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
    setIsLoadingExercises(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setErrors(validation(values));
    setFormSubmitted(true); // Set the formSubmitted flag to true
  };

  useEffect(() => {
    // Check if there are no errors whenever errors state is updated and the form has been submitted
    if (Object.keys(errors).length === 0 && formSubmitted) {
      handleSubmit(); // Trigger form submission when there are no errors and the form has been submitted
    }
  }, [errors, formSubmitted]);

  return (
    <div className="register-app">
      <div className="register-form">
        <h2>Login</h2>
        <form onSubmit={handleFormSubmit} method="post">
          <div className="register-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              id="email"
              placeholder="Enter your email"
            />
            <span className="error">{errors.email && <span>{errors.email}</span>}</span>
          </div>
          <div className="register-form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleInput}
              id="password"
              placeholder="Enter your password"
            />
            <span className="error">{errors.password && <span>{errors.password}</span>}</span>
          </div>
          <input type="submit" name="submit" className="submit" />
          <span className="error">{errorMessage && <span>{errorMessage}</span>}</span>
        </form>
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        {isLoadingExercises && (
                    <div className="fix-top-margin">
                        <h2>Loading...</h2>
                    </div>
                )}
      </div>
    </div>
  );
}

export default Login;
