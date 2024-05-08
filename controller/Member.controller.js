const { Member, Group } = require("../models");
const createMember = async (req, res) => {
  const { fullname, birthday, tshift, position, group_id } = req.body;
  try {
    const newMember = await Member.create({
      fullname,
      birthday,
      tshift,
      position,
      group_id,
    });
    res.status(201).send(newMember);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateMember = async (req, res) => {
  const { id } = req.params;
  const { fullname, birthday, tshift, position } = req.body;
  try {
    const detailMember = await Member.findOne({
      where: {
        id,
      },
    });
    detailMember.fullname = fullname;
    detailMember.birthday = birthday;
    detailMember.tshift = tshift;
    detailMember.position = position;

    await detailMember.save();
    res.status(200).send(detailMember);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAllMember = async (req, res) => {
  const memberList = await Member.findAll({
    include: [
      {
        model: Group,
        attributes: ['name']
      },
    ],
  });
  res.status(200).send(memberList);
};
const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    await Member.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("Xóa thành công");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createMember, updateMember, deleteMember, getAllMember };
