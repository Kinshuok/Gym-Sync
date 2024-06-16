function Workouts() {
    return (<div className="day-panel">
    <h1>Workouts</h1>
    {userWorkouts.map((workout, index) => (
      <div
        key={index}
        className={`workout-item ${hoveredWorkoutIndex === index ? "hovered" : ""}`}
        onMouseEnter={() => setHoveredWorkoutIndex(index)}
        onMouseLeave={() => setHoveredWorkoutIndex(null)}
      >
        <h2>{workout.workoutName}</h2>
        {hoveredWorkoutIndex === index && (
          <div className="action-icons">
            <span className="delete-icon" onClick={() => handleDelete(index)}>
              🗑️
            </span>
            <span className="delete-icon" onClick={() => handleEdit(index)}>
              ✏️
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
              <button onClick={handleEditSubmit} className="create-workout">Save</button>
              <button onClick={handleCancel} className="create-workout">Cancel</button>
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
          <button onClick={handleCreateSubmit} className="create-workout">Create</button>
          <button onClick={handleCancel} className="create-workout">Cancel</button>
        </div>
      </div>
    )}
  </div>);
}

export default Workouts;