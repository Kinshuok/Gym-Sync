function Exercise(props) {
    return (
        <div className="exercise">
            <div className="excercise-header">
                <h3>{props.exerciseName}</h3>
            </div>
            <div className="exercise-body">
                <div className="exercise-info-row">
                    <div className="exercise-info-item">
                        <h4>Sets</h4>
                        <p>{props.sets}</p>
                    </div>
                    <div className="exercise-info-item">
                        <h4>Reps</h4>
                        <p>{props.reps}</p>
                    </div>
                    <div className="exercise-info-item">
                        <h4>Time</h4>
                        <p>{props.time}</p>
                    </div>
                    <div className="exercise-info-item no-pad">
                        <h4>Weight</h4>
                        <p>{props.weight}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Exercise;