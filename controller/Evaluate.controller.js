const { Evaluate, Member } = require("../models");
const { Op, where } = require("sequelize");
const convertDateFormat = require("../ultils/convertDate");

const createEvaluate = async (req, res) => {
  let {
    date,
    scored,
    assist,
    saveGoal,
    ownGoal,
    discipline,
    yellowCard,
    redCard,
  } = req.body;
  try {
    const findEva = await Evaluate.findOne({
      where: {
        date,
      },
    });
    let mess,
      newE,
      updateEv,
      newScored,
      newAssist,
      newSaveGoal,
      newOwnGoal,
      newDiscipline,
      newYellowCard,
      newRedCard;
    if (findEva) {
      if (scored) {
        newScored = await updateJson(findEva.scored, scored);
      }
      if (assist) {
        newAssist = await updateJson(findEva.assist, assist);
      }
      if (saveGoal) {
        newSaveGoal = await updateJson(findEva.save, saveGoal);
      }
      if (ownGoal) {
        newOwnGoal = await updateJson(findEva.ownGoal, ownGoal);
      }
      if (discipline) {
        newDiscipline = await updateJson(findEva.discipline, discipline);
      }
      if (yellowCard) {
        newYellowCard = await updateJson(findEva.yellowCard, yellowCard);
      }
      if (redCard) {
        newRedCard = await updateJson(findEva.redCard, redCard);
      }
      updateEv = await findEva.update({
        scored: newScored || findEva.scored,
        assist: newAssist || findEva.assist,
        saveGoal: newSaveGoal || findEva.saveGoal,
        ownGoal: newOwnGoal || findEva.ownGoal,
        discipline: newDiscipline || findEva.discipline,
        yellowCard: newYellowCard || findEva.yellowCard,
        redCard: newRedCard || findEva.redCard,
      });

      if (updateEv) {
        mess = "Update evaluate successfully";
      }
    } else {
      const finndAllMember = await Member.findAll({
        attributes: ["id"],
      });

      scored = scored || initializeArrayWithDefaultValues(finndAllMember, 0);
      assist = assist || initializeArrayWithDefaultValues(finndAllMember, 0);
      saveGoal =
        saveGoal || initializeArrayWithDefaultValues(finndAllMember, 0);
      ownGoal = ownGoal || initializeArrayWithDefaultValues(finndAllMember, 0);
      discipline =
        discipline || initializeArrayWithDefaultValues(finndAllMember, 0);
      yellowCard =
        yellowCard || initializeArrayWithDefaultValues(finndAllMember, 0);
      redCard = redCard || initializeArrayWithDefaultValues(finndAllMember, 0);

      const _scored = JSON.stringify(scored);
      const _assist = JSON.stringify(assist);
      const _save = JSON.stringify(saveGoal);
      const _ownGoal = JSON.stringify(ownGoal);
      const _discipline = JSON.stringify(discipline);
      const _yellowCard = JSON.stringify(yellowCard);
      const _redCard = JSON.stringify(redCard);

      newE = await Evaluate.create({
        date,
        scored: _scored,
        assist: _assist,
        saveGoal: _save,
        ownGoal: _ownGoal,
        discipline: _discipline,
        yellowCard: _yellowCard,
        redCard: _redCard,
      });

      mess = "Create evaluate successfully";
    }

    res.status(201).send({
      mess,
      data: findEva ? updateEv : newE,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
const initializeArrayWithDefaultValues = (array, defaultValue) => {
  return array.map((item) => ({
    memberId: item.id,
    value: defaultValue,
  }));
};
const updateJson = async (value, newValue) => {
  let data = JSON.parse(value);
  newValue.forEach((newData) => {
    const index = data.findIndex((item) => item.memberId === newData.memberId);
    if (index !== -1) {
      data[index].value = newData.value;
    }
  });
  return JSON.stringify(data);
};
const getEvaluateByDay = async (req, res) => {
  const { day } = req.query;
  try {
    if (!day) {
      return res.status(400).send("Missing day parameter");
    }
    const parts = day.split("-");
    const formattedDate = parts[0] + "/" + parts[1] + "/" + parts[2];
    const evaluate = await Evaluate.findOne({
      where: {
        date: formattedDate,
      },
    });

    if (!evaluate) {
      return res.status(404).send("Evaluate not found");
    }

    res.status(200).send({
      status: 200,
      data: {
        date: evaluate.date,
        scored: evaluate.scored ? JSON.parse(evaluate.scored) : [],
        assist: evaluate.assist ? JSON.parse(evaluate.assist) : [],
        saveGoal: evaluate.saveGoal ? JSON.parse(evaluate.saveGoal) : [],
        ownGoal: evaluate.ownGoal ? JSON.parse(evaluate.ownGoal) : [],
        discipline: evaluate.discipline ? JSON.parse(evaluate.discipline) : [],
        yellowCard: evaluate.yellowCard ? JSON.parse(evaluate.yellowCard) : [],
        redCard: evaluate.redCard ? JSON.parse(evaluate.redCard) : [],
      },
    });
  } catch (error) {
    console.error("Error fetching evaluate:", error);
    res.status(500).send(error.message);
  }
};

module.exports = { createEvaluate, getEvaluateByDay };
