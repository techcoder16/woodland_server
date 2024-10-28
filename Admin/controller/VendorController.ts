import prisma from "../config/db.config";

class UserController {
  // Create a User
  static async createUser(req, res) {
    const { email, password, first_name, last_name } = req.body;

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).send({ message: "User already exists!" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name,
          last_name,
          // Include other fields as necessary
        },
      });

      return res.status(201).send({
        message: "User created successfully!",
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message, error: err });
    }
  }

  // Get Users with Pagination and Search
  static async getUsers(req, res) {
    const { page = 1, limit = 10, search, category, type, status, source, vendor, negotiator } = req.query;

    try {
      const users = await prisma.user.findMany({
        where: {
          ...(search && {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }),
          ...(category && { label_status: category }),
          ...(type && { type }),
          ...(status && { do_not_receive_feedback: status === 'true' }),
          ...(source && { lead_source: source }),
          ...(vendor && { negotiator }),
        },
        skip: (page - 1) * limit,
        take: parseInt(limit, 10),
      });

      const totalUsers = await prisma.user.count({
        where: {
          ...(search && {
            OR: [
              { first_name: { contains: search, mode: 'insensitive' } },
              { last_name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }),
          ...(category && { label_status: category }),
          ...(type && { type }),
          ...(status && { do_not_receive_feedback: status === 'true' }),
          ...(source && { lead_source: source }),
          ...(vendor && { negotiator }),
        },
      });

      res.json({
        users,
        total: totalUsers,
        page: parseInt(page, 10),
        totalPages: Math.ceil(totalUsers / limit),
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message, error: err });
    }
  }

  // Update a User
  static async updateUser(req, res) {
    const { id } = req.params;

    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: req.body,
      });

      return res.status(200).send({
        message: "User updated successfully!",
        user: updatedUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message, error: err });
    }
  }

  // Delete a User
  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      await prisma.user.delete({
        where: { id },
      });
      return res.status(204).send();
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message, error: err });
    }
  }
}

export default UserController;
