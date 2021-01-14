// Function exerciseList on hold
const exerciseList = async (event) => {
  event.preventDefault();
  const routine_id = $("#savedRoutine option:selected").val();
  console.log(routine_id);
  const response = await fetch(`/api/routine/${routine_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const routine = await response.json();
  const { array_of_exercises } = routine;

  array_of_exercises.forEach(exercise => {
    const newRow =
      `<div class="col-5">
        <div class="form-group">
          <textarea class="form-control" id="name" rows="1">${exercise.name}</textarea>
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <textarea class="form-control" id="sets" rows="1">${exercise.sets}</textarea>
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <textarea class="form-control" id="reps" rows="1">${exercise.reps}</textarea>
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <textarea class="form-control" id="weight" rows="1">${exercise.weight}</textarea>
        </div>
      </div>
      <div class="col-1">
        <button class="button btn rounded" id="saveEachBtn"><i class="fas fa-check"></i></button>
      </div>`;
    console.log(newRow);
    $(".workoutList").append(newRow);
  });
};

const startWorkout = async (event) => {
  event.preventDefault();

  const routine_id = $("#savedRoutine option:selected").val();

  const response = await fetch(`/api/routine/${routine_id}`);

  if (response.ok) {
    document.location.replace(`/routine/${routine_id}`);
  } else {
    alert("Please Select myRoutine :)");
  }
};

const updateWorkout = async (event) => {
  event.preventDefault();

  const updateId = $("#updateBtn").attr("updateId");
  console.log(updateId);

  const array_of_exercises = [];

  const name = $("#name").val();
  const sets = $("#sets").val();
  const reps = $("#reps").val();
  const weight = $("#weight").val();

  array_of_exercises.push({
    name: name,
    sets: sets,
    reps: reps,
    weight: weight,
  });
  console.log(array_of_exercises);

  const responseWorkout = await fetch(`/api/routine/${updateId}`, {
    method: "PUT",
    body: JSON.stringify(
      {
        array_of_exercises
      }
    ),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (responseWorkout.ok) {
    document.location.replace(`/routine/${updateId}`);
  } else {
    alert("Routine not found.");
  }
};

const array_of_results = [];

const progressArray = async (event) => {
  event.preventDefault();

  $("#saveEachBtn").css("background", "green");

  const name = $("#name").val();
  const sets = $("#sets").val();
  const reps = $("#reps").val();
  const weight = $("#weight").val();

  array_of_results.push({
    name: name,
    sets: sets,
    reps: reps,
    weight: weight,
  });
  console.log(array_of_results);
};

const saveProgress = async () => {

  const routine_id = $("#saveProgressBtn").attr("saveId");
  console.log(routine_id);

  console.log(array_of_results);

  const responseWorkout = await fetch("/api/workout", {
    method: "POST",
    body: JSON.stringify({ routine_id, array_of_results }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (responseWorkout.ok) {
    document.location.replace("/dashboard");
  } else {
    alert("Failed to save progress.");
  }
};

$(document).on("click", "#goBtn", startWorkout);
$(document).on("click", "#updateBtn", updateWorkout);
$(document).on("click", "#saveEachBtn", progressArray);
$(document).on("click", "#saveProgressBtn", saveProgress);