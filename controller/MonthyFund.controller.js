const { MonthyFund, Member, Transaction, Group } = require("../models");
const { Op } = require("sequelize");
const convertDateFormat = require("../ultils/convertDate");

const getmMonthlyFund = async (req, res) => {
  const { date } = req.query;
  try {
    const result = await MonthyFund.findOne({
      where: {
        date: date.replace("-", "/"),
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!result)
      return res.status(404).json({ error: "Monthly fund not found" });
    const memberUnContributedIds = result.uncontributed_list
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
    const uncontributed_lists = await Member.findAll({
      where: {
        id: {
          [Op.in]: memberUnContributedIds,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const memberContributedIds = result.contributed_list
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
    const contributed_lists = await Member.findAll({
      where: {
        id: {
          [Op.in]: memberContributedIds,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    const memberNoNeedIds = result.list_no_need
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));
    const list_no_needs = await Member.findAll({
      where: {
        id: {
          [Op.in]: memberNoNeedIds,
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(201).send({
      status: 200,
      data: {
        id: result.id,
        groupId: result.groupId,
        member_needs_to_pay: result.member_needs_to_pay,
        type: result.type,
        collected: result.collected,
        date: result.date,
        list_no_need: list_no_needs,
        contributed_list: contributed_lists,
        uncontributed_lists,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send(error);
  }
};

const createMonthlyFund = async (req, res) => {
  const { date, member_needs_to_pay, type } = req.body;
  const id = req.user.id;
  try {
    if (type !== 3) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    const existingMonthlyFund = await MonthyFund.findOne({
      where: { type: 3, date: "05/2024" },
    });

    if (existingMonthlyFund) {
      return res
        .status(400)
        .json({ error: "Monthly fund for 05/2024 already exists" });
    }
    const findGroup = await Group.findOne({ where: { userId: id } });
    if (!findGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    const findMember = await Member.findAll({
      attributes: ["id"],
    });
    if(!findMember){
      return res.status(404).json({ error: "Add members to the group before creating a fund" });
    }
    const uncontributed_list = findMember.map((member) => member.id).join(",");
    await MonthyFund.create({
      groupId: findGroup.id,
      date,
      member_needs_to_pay,
      type,
      collected: 0,
      list_no_need: "",
      contributed_list: "",
      uncontributed_list,
    });
    res.status(201).send({
      status: 200,
      mes: "Create monthly fund",
    });
  } catch (error) {
    console.log("🚀 ~ createTransaction ~ error:", error);
    res.status(500).send(error);
  }
};

const editMonthlyFund = async (req, res) => {
  const { date, member_needs_to_pay, type } = req.body;
  const id = req.user.id;
  try {
    if (type !== 3) {
      return res.status(400).json({ error: "Invalid transaction type" });
    }
    const findGroup = await Group.findOne({ where: { userId: id } });
    if (!findGroup) {
      return res.status(404).json({ error: "Group not found" });
    }
    const newMonthlyFund = await MonthyFund.update(
      { member_needs_to_pay },
      { where: { groupId: findGroup.id, date, type } }
    );
    res.status(201).send({
      status: 200,
      mes: "updated monthly fund",
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const contributeFunds = async (req, res) => {
  const { memberId, date, noNeed } = req.body;
  try {
    if (!memberId || !date) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const foundMonthlyFund = await MonthyFund.findOne({
      where: { type: 3, date },
    });
    if (!foundMonthlyFund) {
      return res.status(404).json({ error: "Monthly fund not found" });
    }

    let uncontributedListArray = await foundMonthlyFund.uncontributed_list
      .split(",")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const index = await uncontributedListArray.indexOf(memberId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Member not found in uncontributed list" });
    }

    await uncontributedListArray.splice(index, 1);
    foundMonthlyFund.uncontributed_list = await uncontributedListArray.join(
      ","
    );
    if (noNeed) {
      foundMonthlyFund.list_no_need += (await memberId.toString()) + ",";
      message = "Add Member to no need list successfully";
    } else {
      foundMonthlyFund.contributed_list += (await memberId.toString()) + ",";
      foundMonthlyFund.collected += await foundMonthlyFund.member_needs_to_pay;
      message = "Add Member to contributed list successfully";
      await Transaction.create({
        type: 3,
        content: `Đóng quỹ tháng ${date}`,
        value: foundMonthlyFund.member_needs_to_pay,
        note: `${memberId}`,
        createdAt: convertDateFormat(`01/${date} 00:00:00`),
      });
    }
    await foundMonthlyFund.save();

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).send(error);
  }
};
const uncontributeFunds = async (req, res) => {
  const { memberId, date, noNeed } = req.body;
  try {
    if (!memberId || !date) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const foundMonthlyFund = await MonthyFund.findOne({
      where: { type: 3, date },
    });
    if (!foundMonthlyFund) {
      return res.status(404).json({ error: "Monthly fund not found" });
    }

    let contributedListArray = foundMonthlyFund.contributed_list
      .split(",")
      .filter((id) => id !== "")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const index = contributedListArray.indexOf(memberId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Member not found in contributed list" });
    }

    contributedListArray.splice(index, 1);
    if (noNeed) {
      // Move member in contributed to no need list
      foundMonthlyFund.list_no_need += (await memberId.toString()) + ",";
      message = "Remove Member from no need list successfully";
    } else {
      // Move member in contributed to uncontributed list
      foundMonthlyFund.uncontributed_list += memberId.toString() + ",";
      message = "Remove Member from contributed list successfully";
      await Transaction.destroy({
        where: {
          type: 3,
          content: `Đóng quỹ tháng ${date}`,
          note: `${memberId}`,
        },
      });
    }
    foundMonthlyFund.collected -= foundMonthlyFund.member_needs_to_pay;
    foundMonthlyFund.contributed_list = contributedListArray.join(",");

    await foundMonthlyFund.save();

    res.status(200).json({ message });
  } catch (error) {
    res.status(500).send(error);
  }
};
const noNeedToContribute = async (req, res) => {
  const { memberId, date } = req.body;
  try {
    if (!memberId || !date) {
      return res.status(400).send({ error: "Missing required fields" });
    }
    const foundMonthlyFund = await MonthyFund.findOne({
      where: { type: 3, date },
    });
    if (!foundMonthlyFund) {
      return res.status(404).json({ error: "Monthly fund not found" });
    }

    let noNeedListArray = foundMonthlyFund.list_no_need
      .split(",")
      .filter((id) => id !== "")
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    const index = noNeedListArray.indexOf(memberId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Member not found in no need list" });
    }

    noNeedListArray.splice(index, 1);
    foundMonthlyFund.uncontributed_list += (await memberId.toString()) + ",";
    message = "Remove Member from no need list successfully";
    foundMonthlyFund.list_no_need = noNeedListArray.join(",");

    await foundMonthlyFund.save();

    res.status(200).json({
      message,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  getmMonthlyFund,
  noNeedToContribute,
  createMonthlyFund,
  editMonthlyFund,
  contributeFunds,
  uncontributeFunds,
};
