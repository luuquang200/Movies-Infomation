
module.exports = {
    // get content
    getContent: async (req, res) => {
        try {
            res.render('dataImport', { layout: 'main' });
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },
};
  