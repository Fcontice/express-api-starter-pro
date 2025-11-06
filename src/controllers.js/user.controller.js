export const me = async (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
};

export const adminOnly = async (_req, res) => {
  res.json({ secret: "admin data" });
};
