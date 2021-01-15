const router = require("express").Router();
const { Routine, Exercise } = require("../../models");
const withAuth = require("../../utils/auth")

router.post("/", withAuth, async (req, res) => {
  try {
    const newRoutine = await Routine.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newRoutine);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const routineDelete = await Routine.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!routineDelete) {
      res.status(404).json({ message: "No routine found with this id!" });
      return;
    }

    res.status(200).json(routineDelete);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const routineData = await Routine.findAll({
      where: {
        user_id: req.session.user_id,
      }
    });
    const routines = routineData.map((routine) => routine.get({ plain: true }));
    res.json(routines);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/:id", withAuth, async (req, res) => {
  try {
    const routineData = await Routine.findByPk(req.params.id);
    const routine = routineData.get({ plain: true });
    res.json(routine);
    
  } catch (err) {
    // Server error response 500 - Internal Server Error
    res.status(500).json(err.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updateRoutine = await Routine.update(
      {
        ...req.body,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );

    if (!updateRoutine) {
      // Client error response 404 - Not found
      res.status(404).json({ message: "No routine found with this id!" });
      return;
    }
    // Sucess response 200 - OK
    res.status(200).json(updateRoutine);
  } catch (err) {
    // Client error response 400 - Bad request
    res.status(400).json(err.message);
  }
});

module.exports = router;
