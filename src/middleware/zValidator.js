export const zValidator = (schema) => (req, res, next) => {
  try { req.body = schema.parse(req.body); next(); }
  catch (err) { res.status(400).json({ message: err.errors?.[0]?.message || "Invalid payload" }); }
};
