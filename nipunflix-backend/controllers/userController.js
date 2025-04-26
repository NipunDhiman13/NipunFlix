exports.getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id)
        .select('-password -__v');
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  