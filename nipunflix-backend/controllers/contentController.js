exports.getContent = async (req, res) => {
    try {
      const content = await Content.find()
        .populate('createdBy', 'username email');
      
      res.status(200).json(content);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  