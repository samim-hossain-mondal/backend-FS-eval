const tokenValidator = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }
  const data = await fetch('http://localhost:4000/token/validate', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'authorization': token,
    }
  });
  const result = await data.json();
  console.log(result);

  if (!result.message) {
    return res.status(401).json({ message: 'Invalid Token' });
  }
  else {
    next();
  }
};

module.exports = { tokenValidator };