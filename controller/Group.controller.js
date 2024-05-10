const { Group } = require("../models");
const { Op } = require("sequelize");

const createGroup = async (req, res) => {
  const { name, description, avatar, country, city, district } = req.body;
  const userId = req.user.id;
  try {
    const existingGroup = await Group.findOne({ where: { userId } });

    if (existingGroup) {
      return res.status(400).json({ error: "Group already exists" });
    }

    const newGroup = await Group.create({
      name,
      userId,
      description,
      avatar,
      country,
      city,
      district,
      balance: 0,
      ranking: 0,
    });

    res.status(201).send(newGroup);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateGroup = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    avatar,
    country,
    city,
    district,
    balance,
    ranking,
  } = req.body;
  try {
    const detailGroup = await Group.findOne({
      where: {
        id,
      },
    });
    detailGroup.name = name;
    detailGroup.description = description;
    detailGroup.avatar = avatar;
    detailGroup.country = country;
    detailGroup.city = city;
    detailGroup.district = district;
    detailGroup.balance = balance;
    detailGroup.ranking = ranking;

    await detailGroup.save();
    res.status(200).send(detailGroup);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getName = async (req, res) => {
  const { name } = req.query;

  try {
    if (name) {
      const groupList = await Group.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      res.status(200).send(groupList);
    } else {
      const groupList = await Group.findAll();
      res.status(200).send(groupList);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteGroup = async (req, res) => {
  const { id } = req.params;
  try {
    await Group.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("Xóa thành công");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createGroup, updateGroup, deleteGroup, getName };
