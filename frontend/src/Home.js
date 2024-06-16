import React, { useState, useEffect } from "react";
import userLogo from "./user.png";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCheck , faTrash, faShare, faUpload} from "@fortawesome/free-solid-svg-icons";
import { set } from "mongoose";

function Home() {
    const username = localStorage.getItem("username");
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [workoutName, setWorkoutName] = useState("");
    const [editWorkoutName, setEditWorkoutName] = useState("");
    const [userWorkouts, setUserWorkouts] = useState([]);
    const [userSharedWorkouts, setUserSharedWorkouts] = useState([]);
    const [hoveredWorkoutIndex, setHoveredWorkoutIndex] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [selectedDay, setSelectedDay] = useState("Monday");
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSharedWorkoutIndex, setSelectedSharedWorkoutIndex] = useState(null);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isLoadingExercises, setIsLoadingExercises] = useState(false);

    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(null);
    const [showExerciseForm, setShowExerciseForm] = useState(false);
    const [exerciseName, setExerciseName] = useState("");
    const [numberOfSets, setNumberOfSets] = useState("");
    const [numberOfRepetitions, setNumberOfRepetitions] = useState("");
    const [exerciseTime, setExerciseTime] = useState("");
    const [exerciseWeight, setExerciseWeight] = useState("");
    const [exercises, setExercises] = useState([]);
    const [editExerciseIndex, setEditExerciseIndex] = useState(null);
    const [editedExerciseName, setEditedExerciseName] = useState("");
    const [editedNumberOfSets, setEditedNumberOfSets] = useState("");
    const [editedNumberOfRepetitions, setEditedNumberOfRepetitions] = useState("");
    const [editedExerciseTime, setEditedExerciseTime] = useState("");
    const [editedExerciseWeight, setEditedExerciseWeight] = useState("");
    const [hoveredSelectedWorkoutIndex, setHoveredSelectedWorkoutIndex] = useState(null);


    const navigate = useNavigate();

    useEffect(() => {
        if (!username) {
            navigate("/login");
        }
        const fetchUserWorkouts = async () => {
            try {
                setIsLoadingExercises(true);
                const response = await fetch(`https://gymance-y7ux.onrender.com/getWorkouts/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserWorkouts(data.workouts || []);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching workouts:", error.message);
            }
            finally {
                setIsLoadingExercises(false);
            }
        };
        fetchUserWorkouts();
    }, [username]);

    useEffect(() => {
        const fetchSharedExcercises = async () => {
            if (selectedSharedWorkoutIndex !== null) {
                try {
                    setIsLoadingExercises(true);
                    const response = await fetch(`https://gymance-y7ux.onrender.com/getSharedExercises/${username}/${selectedSharedWorkoutIndex}/${selectedDay}`);
                    if (response.ok) {
                        const data = await response.json();
                        setExercises(data.exercises || []);
                        if (exercises.length === 0) {
                            setIsLoadingExercises(true);
                        }
                    } else {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                }
                catch (error) {
                    console.error("Error fetching exercises:", error.message);
                }
                finally {
                    setIsLoadingExercises(false);
                }
            }
        };
        fetchSharedExcercises();
    }, [username, selectedSharedWorkoutIndex, selectedDay]);

    useEffect(() => {
        const fetchUserExercises = async () => {
            try {
                setIsLoadingExercises(true);
                const response = await fetch(`https://gymance-y7ux.onrender.com/getExercises/${username}/${selectedWorkoutIndex}/${selectedDay}`);
                if (response.ok) {
                    const data = await response.json();
                    setExercises(data.exercises || []);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching exercises:", error.message);
                setExercises([]);
            }
            finally {
                setIsLoadingExercises(false);
            }
        };
        fetchUserExercises();
    }, [username, selectedWorkoutIndex, selectedDay]);

    useEffect(() => {
        const fetchUserSharedWorkouts = async () => {
            try {
                const response = await fetch(`https://gymance-y7ux.onrender.com/getSharedWorkouts/${username}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserSharedWorkouts(data.sharedWorkouts || []);
                } else {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
            } catch (error) {
                console.error("Error fetching shared workouts:", error.message);
            }
        };
        fetchUserSharedWorkouts();
    }, [username]);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const selectDay = (day) => {
        setSelectedDay(day);
        setShowDropdown(false);
    };

    const addWorkout = () => {
        setShowForm(true);
    };

    const Logout = () => {
        localStorage.removeItem("username");
        navigate("/login");
    };

    const showWorkouts = () => {
        if (window.innerWidth < 768) {
            document.querySelector(".day-panel").style.display = "block";
            document.querySelector(".dashboard").style.display = "none";
            document.querySelector(".day-panel").style.width = "100%";
        }
    }

    const showDashboard = () => {
        if (window.innerWidth < 768) {
            document.querySelector(".day-panel").style.display = "none";
            document.querySelector(".dashboard").style.display = "block";
            document.querySelector(".dashboard").style.width = "100%";
        }
    }

    const handleCreateSubmit = async () => {
        try {
            const response = await fetch("https://gymance-y7ux.onrender.com/addWorkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutName: workoutName,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            setUserWorkouts([...userWorkouts, { workoutName }]);
            setWorkoutName("");
            setShowForm(false);
        } catch (error) {
            console.error("Error adding workout:", error.message);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const response = await fetch("https://gymance-y7ux.onrender.com/updateWorkoutName", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: editIndex,
                    newName: editWorkoutName,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedWorkouts = [...userWorkouts];
            updatedWorkouts[editIndex].workoutName = editWorkoutName;
            setUserWorkouts(updatedWorkouts);

            setEditWorkoutName("");
            setEditIndex(null);
            setShowEditForm(false);
        } catch (error) {
            console.error("Error updating workout name:", error.message);
        }
    };

    const handleDelete = async (index) => {
        try {
            const response = await fetch("https://gymance-y7ux.onrender.com/deleteWorkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: index,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedWorkouts = [...userWorkouts];
            updatedWorkouts.splice(index, 1);
            setUserWorkouts(updatedWorkouts);

            if (editIndex === index) {
                setShowEditForm(false);
                setEditIndex(null);
                setEditWorkoutName("");
            }

            // Reset selected workout index and exercises when the current workout is deleted
            if (selectedWorkoutIndex === index) {
                setSelectedWorkoutIndex(null); // Set to the first workout or another default index
                const updatedExercises = await fetchUpdatedExercises();
                setExercises(updatedExercises);
                setSelectedWorkout(null);
            }
        } catch (error) {
            console.error("Error deleting workout:", error.message);
        }
    };

    const handleEdit = async (index) => {
        setEditIndex(index);
        setEditWorkoutName(userWorkouts[index].workoutName);
        setShowEditForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setShowEditForm(false);
        setWorkoutName("");
        setEditWorkoutName("");
        setEditIndex(null);
    };

    const selectWorkout = (index) => {
        setSelectedWorkoutIndex(index);
        setSelectedSharedWorkoutIndex(null);
        setSelectedWorkout(userWorkouts[index]);
    };

    const selectSharedWorkout = (index) => {
        setSelectedSharedWorkoutIndex(index);
        setSelectedWorkoutIndex(null);
        setSelectedWorkout(userSharedWorkouts[index]);
    }

    const displayExerciseForm = () => {
        setShowExerciseForm(true);
    };

    const displayBackAndSet = () => {
        setEditExerciseIndex(null);
        const allExercises = document.querySelectorAll(".exercise");
        allExercises.forEach(exercise => {
            exercise.classList.remove("hidden");
        });
    }

    const moveToWorkouts = async (index) => {
        try {
            const response = await fetch(`https://gymance-y7ux.onrender.com/moveToWorkouts/${username}/${index}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: index,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setUserWorkouts(data.workouts || []);
                setUserSharedWorkouts(data.sharedWorkouts || []);
                window.location.reload();
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching shared workouts:", error.message);
        }
    }

    const handleExerciseSubmit = async () => {
        try {
            // Validate exercise name before submitting
            if (!exerciseName) {
                // Show error message using the error class
                console.error("Exercise name is required.");
                return;
            }

            const response = await fetch("https://gymance-y7ux.onrender.com/addExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exercise: {
                        name: exerciseName || "N/A",
                        sets: numberOfSets || "N/A",
                        repetitions: numberOfRepetitions || "N/A",
                        time: exerciseTime || "N/A",
                        weight: exerciseWeight || "N/A",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);

            // Reset the exercise form state
            setExerciseName("");
            setNumberOfSets("");
            setNumberOfRepetitions("");
            setExerciseTime("");
            setExerciseWeight("");
            setShowExerciseForm(false);
        } catch (error) {
            console.error("Error adding exercise:", error.message);
        }
    };

    const handleShare = async (index) => {
        const shareUsername = prompt("Enter username to share with:");
        if (shareUsername) {
            try {
                const response = await fetch(`https://gymance-y7ux.onrender.com/shareWorkout/${shareUsername}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        workoutIndex: index,
                    }),
                });
                const errorMessage = await response.text();
                if (response.status === 404) {
                    alert(`User does not exist`);
                }
            } catch (error) {
                alert("Error sharing workout");
            }
        }
    };
    

    const handleDeleteExercise = async (index) => {
        try {
            const response = await fetch("https://gymance-y7ux.onrender.com/deleteExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exerciseIndex: index,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);
        } catch (error) {
            console.error("Error deleting exercise:", error.message);
        }
    };

    const handleEditExercise = (index) => {
        // Set the edit state and populate values for the selected exercise
        setEditExerciseIndex(index);
        const selectedExercise = exercises[index];
        setEditedExerciseName(selectedExercise.name);
        setEditedNumberOfSets(selectedExercise.sets);
        setEditedNumberOfRepetitions(selectedExercise.repetitions);
        setEditedExerciseTime(selectedExercise.time);
        setEditedExerciseWeight(selectedExercise.weight);
        const allExercises = document.querySelectorAll(".exercise");
        allExercises.forEach(exercise => {
            exercise.classList.add("hidden");
        });
    };

    const handleUpdateExercise = async (index) => {
        try {
            // Validate edited exercise name before submitting
            if (!editedExerciseName) {
                console.error("Exercise name is required.");
                return;
            }

            const response = await fetch("https://gymance-y7ux.onrender.com/updateExercise", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    workoutIndex: selectedWorkoutIndex,
                    day: selectedDay,
                    exerciseIndex: index,
                    updatedExercise: {
                        name: editedExerciseName || "N/A",
                        sets: editedNumberOfSets || "N/A",
                        repetitions: editedNumberOfRepetitions || "N/A",
                        time: editedExerciseTime || "N/A",
                        weight: editedExerciseWeight || "N/A",
                    },
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Fetch the updated exercises for the selected workout and day
            const updatedExercises = await fetchUpdatedExercises();
            setExercises(updatedExercises);

            // Reset the exercise editing state
            setEditExerciseIndex(null);
            setEditedExerciseName("");
            setEditedNumberOfSets("");
            setEditedNumberOfRepetitions("");
            setEditedExerciseTime("");
            setEditedExerciseWeight("");
            const allExercises = document.querySelectorAll(".exercise");
            allExercises.forEach(exercise => {
                exercise.classList.remove("hidden");
            });
        } catch (error) {
            console.error("Error updating exercise:", error.message);
        }
    };

    const fetchUpdatedExercises = async () => {
        try {
            const response = await fetch(`https://gymance-y7ux.onrender.com/getExercises/${username}/${selectedWorkoutIndex}/${selectedDay}`);
            if (response.ok) {
                const data = await response.json();
                return data.exercises || [];
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error("Error fetching exercises:", error.message);
            return [];
        }
    };

    return (
        <div className="container">
            <div className="day-panel">
                <h1>Workouts</h1>
                {userWorkouts.map((workout, index) => (
                    <div
                        key={index}
                        className={`workout-item ${hoveredWorkoutIndex === index ? "hovered" : ""} ${selectedWorkoutIndex === index ? "selected-workout" : ""}`}
                        onMouseEnter={() => setHoveredWorkoutIndex(index)}
                        onMouseLeave={() => setHoveredWorkoutIndex(null)}
                        onClick={() => selectWorkout(index)}
                    >
                        <h2>{workout.workoutName}</h2>
                        {hoveredWorkoutIndex === index && (
                            <div className="action-icons">
                                <span className="hide" onClick={showDashboard}>
                                <FontAwesomeIcon icon={faCheck} style={{color: "#ffffff",}} />
                                </span>
                                <span className="delete-icon" onClick={() => handleEdit(index)}>
                                <FontAwesomeIcon icon={faPenToSquare} style={{color: "#ffffff",}} />
                                </span>
                                <span className="delete-icon" onClick={() => handleShare(index)}>
                                    <FontAwesomeIcon icon={faShare} style={{color: "#ffffff",}} />
                                </span>
                                <span className="delete-icon" onClick={() => handleDelete(index)}>
                                    <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
                                </span>
                            </div>
                        )}
                        {showEditForm && editIndex === index && (
                            <div className="workout-form">
                                <input
                                    type="text"
                                    placeholder="Enter new workout name"
                                    className="workout-name"
                                    value={editWorkoutName}
                                    onChange={(e) => setEditWorkoutName(e.target.value)}
                                />
                                <div className="form-buttons">
                                    <button onClick={handleEditSubmit} className="create-workout">
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className="create-workout">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <h3 className="add" onClick={addWorkout}>
                    Add a new workout schedule <span className="add-button">+</span>
                </h3>
                {showForm && (
                    <div className="workout-form">
                        <input
                            type="text"
                            placeholder="Enter workout name"
                            className="workout-name"
                            value={workoutName}
                            onChange={(e) => setWorkoutName(e.target.value)}
                        />
                        <div className="form-buttons">
                            <button onClick={handleCreateSubmit} className="create-workout">
                                Create
                            </button>
                            <button onClick={handleCancel} className="create-workout">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
                <h1>Shared Workouts</h1>
                {userSharedWorkouts.map((sharedWorkout, index) => (
                    <div
                        key={index}
                        className={`workout-item ${hoveredSelectedWorkoutIndex === index ? "hovered" : ""} ${selectedSharedWorkoutIndex === index ? "selected-workout" : ""}`}
                        onClick={() => selectSharedWorkout(index)}
                        onMouseEnter={() => setHoveredSelectedWorkoutIndex(index)}
                        onMouseLeave={() => setHoveredSelectedWorkoutIndex(null)}
                    >
                        <h2>{sharedWorkout.workoutName}</h2>
                        {hoveredSelectedWorkoutIndex === index && (
                            <div className="">
                                <span className="delete-icon" onClick={() => moveToWorkouts(index)}>
                                    <FontAwesomeIcon icon={faUpload} style={{color: "#ffffff",}} />
                                </span>
                            </div>
                        )}
                    </div>
                ))}

            </div>
            <div className="dashboard">
                <div className="dashboard-nav">
                    <h1 className="username">{username}'s Dashboard</h1>
                    <div className="account">
                        <img src={userLogo} alt="user" />
                        <div>
                            <button className="logout" onClick={Logout}>Logout</button>
                        </div>
                    </div>
                </div>
                {(userWorkouts[selectedWorkoutIndex] || userSharedWorkouts[selectedSharedWorkoutIndex]) && (
                    <div className="dropdown">
                        <div className={`select ${showDropdown ? "select-clicked" : ""}`} onClick={toggleDropdown}>
                            <span className={`selected ${showDropdown ? "" : ""}`}>{selectedDay}</span>
                            <div className={`caret ${showDropdown ? "caret-rotate" : ""}`}></div>
                        </div>
                        <ul className={`menu ${showDropdown ? "menu-open" : ""}`}>
                            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                <li key={day} className={selectedDay === day ? "active" : ""} onClick={() => selectDay(day)}>
                                    {day}
                                </li>
                            ))}
                        </ul>
                        <div className="addExcercise" onClick={displayExerciseForm}>
                            +
                        </div>
                    </div>
                )}
                {showExerciseForm && (
                    <div className="exercise-form">
                        <input
                            type="text"
                            placeholder="Exercise Name"
                            className="exercise-name"
                            value={exerciseName}
                            onChange={(e) => setExerciseName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Number of Sets"
                            className="number-of-sets"
                            value={numberOfSets}
                            onChange={(e) => setNumberOfSets(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Number of Repetitions"
                            className="number-of-repetitions"
                            value={numberOfRepetitions}
                            onChange={(e) => setNumberOfRepetitions(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Time"
                            className="exercise-time"
                            value={exerciseTime}
                            onChange={(e) => setExerciseTime(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Weight"
                            className="exercise-weight"
                            value={exerciseWeight}
                            onChange={(e) => setExerciseWeight(e.target.value)}
                        />
                        <div className="form-buttons">
                            <button onClick={handleExerciseSubmit} className="create-exercise-1">
                                Submit
                            </button>
                            <button onClick={() => setShowExerciseForm(false)} className="create-exercise-1">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {selectedWorkout? (
                    <div className="exercises-list">
                        <h2>Exercises for {selectedWorkout?.workoutName} - {selectedDay}</h2>
                        <button className="select-workout" onClick={showWorkouts}>Select Workout</button>
                        <ul>
                            {exercises.map((exercise, index) => (
                                <li key={index} className="exercise-item">
                                    <div className="exercise">
                                        <div className="excercise-header">
                                            <h3 className="exercise-name">{exercise.name}</h3>
                                            <div className="action-icons exercise-icons">
                                                <span className="icon" onClick={() => handleDeleteExercise(index)}>
                                                <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
                                                </span>
                                                {editExerciseIndex === index ? (
                                                    <>
                                                        <span className="icon" onClick={() => handleUpdateExercise(index)}>
                                                            ✔️
                                                        </span>
                                                        <span className="icon" onClick={() => setEditExerciseIndex(null)}>
                                                        <FontAwesomeIcon icon={faTrash} style={{color: "#ffffff",}} />
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="icon" onClick={() => handleEditExercise(index)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} style={{color: "#ffffff",}} />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="exercise-body">
                                            <div className="exercise-info-row">
                                                <div className="exercise-info-item">
                                                    <h4>Sets</h4>
                                                    <p>{exercise.sets}</p>
                                                </div>
                                                <div className="exercise-info-item">
                                                    <h4>Reps</h4>
                                                    <p>{exercise.repetitions}</p>
                                                </div>
                                                <div className="exercise-info-item">
                                                    <h4>Time</h4>
                                                    <p>{exercise.time}</p>
                                                </div>
                                                <div className="exercise-info-item no-pad">
                                                    <h4>Weight</h4>
                                                    <p>{exercise.weight}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {editExerciseIndex === index && (
                                        <div className="edit-exercise-form">
                                            <h3 className="input-header">Name</h3><input
                                                type="text"
                                                placeholder="Edit Exercise Name"
                                                className="exercise-name heading"
                                                value={editedExerciseName}
                                                onChange={(e) => setEditedExerciseName(e.target.value)}
                                            />
                                            <h3 className="input-header">Sets</h3><input
                                                type="text"
                                                placeholder="Edit Number of Sets"
                                                className="number-of-sets"
                                                value={editedNumberOfSets}
                                                onChange={(e) => setEditedNumberOfSets(e.target.value)}
                                            />
                                            <h3 className="input-header">Reps</h3><input
                                                type="text"
                                                placeholder="Edit Number of Repetitions"
                                                className="number-of-repetitions"
                                                value={editedNumberOfRepetitions}
                                                onChange={(e) => setEditedNumberOfRepetitions(e.target.value)}
                                            />
                                            <h3 className="input-header">Time</h3><input
                                                type="text"
                                                placeholder="Edit Time"
                                                className="exercise-time"
                                                value={editedExerciseTime}
                                                onChange={(e) => setEditedExerciseTime(e.target.value)}
                                            />
                                            <h3 className="input-header">Weight</h3><input
                                                type="text"
                                                placeholder="Edit Weight"
                                                className="exercise-weight"
                                                value={editedExerciseWeight}
                                                onChange={(e) => setEditedExerciseWeight(e.target.value)}
                                            />
                                            <div className="ex-form-buttons">
                                                <button onClick={() => handleUpdateExercise(index)} className="create-exercise">
                                                    Save
                                                </button>
                                                <button onClick={displayBackAndSet} className="create-exercise">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {exercises.length === 0 && (
                            <div className="no-exercises">
                                <h3>No exercises for this day</h3>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="fix-top-margin">
                        <h2>No workout selected</h2>
                        <button className="select-workout" onClick={showWorkouts}>Select Workout</button>
                    </div>
                )}
                {isLoadingExercises && (
                    <div className="fix-top-margin">
                        <h2>Loading...</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
