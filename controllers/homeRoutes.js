const router = require("express").Router();
const { User, Exercise, Routine, Workout } = require("../models");
const withAuth = require("../utils/auth");
router.get("/", async (req, res) => {
  // If the user is already logged in, redirect the request to another route.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("home");
});
router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("login");
});
router.get("/signup", (req, res) => {
  // If the user is already logged in, redirect the request to another route.
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }
  res.render("signup");
});
// Use withAuth middleware to prevent access to route
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [
        { 
          model: Workout,
          attributes: [ "array_of_results", "date" ],
          include: [
            {
              model: Routine,
              attributes: ["name_routine", "array_of_exercises"],
              include: [
                {
                  model: Exercise,
                  attributes: ["name"]
                }
              ]
            }
          ]
         }
      ],
    });
    const user = userData.get({ plain: true });
    console.log(user)
    res.render("dashboard", {
      ...user,
      logged_in: true
    });
  } catch (err) {
    // Server error response 500 - Internal Server Error
    res.status(500).json(err.message);
  }
});
// Use withAuth middleware to prevent access to route
router.get("/routine", withAuth, async (req, res) => {
  try {

    const exerciseData = await Exercise.findAll ();
    const exercises = exerciseData.map((exercise) => exercise.get({ plain: true }));

    const routineData = await Routine.findAll({
      where: {
        user_id: req.session.user_id
      }
    });
    const routines = routineData.map((routine) => routine.get({ plain: true }));

    res.render("routine", {
      exercises,
      routines,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    // Server error response 500 - Internal Server Error
    res.status(500).json(err.message);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/routine/:id", withAuth, async (req, res) => {
  try {
    const routineData = await Routine.findByPk(req.params.id
    //   , {
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["name"],
    //     }
    //   ]
    // }
    );
    
    const routine = routineData.get({ plain: true });

    res.render("workout", {
      ...routine,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    // Server error response 500 - Internal Server Error
    res.status(500).json(err.message);
  }
});

// // Use withAuth middleware to prevent access to route
// router.get("/workout/:id", withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const workoutData = await Workout.findOne( {
//       attributes:["array_of_results"],
//       include: [
//                 {
//                   model: Routine,
//                   attributes: ["name_routine"],
//                 }
//               ],
//       where: {
//         routine_id: req.params.id,
//       }
//     });
//     const workout = workoutData.get({ plain: true });
//     console.log(workout);
//     res.render("workout", {
//       ...workout,
//       logged_in: true
//     });
//   } catch (err) {
//     // Server error response 500 - Internal Server Error
//     res.status(500).json(err.message);
//   }
// });
module.exports = router;