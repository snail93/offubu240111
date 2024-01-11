/* GET homepage */
const about = (req, res) => {
  res.render('generic-text', { 
    title: 'About',
    content: 'user vec management system standalone, what is the integration vec? ... including AWS set'
  });
};

module.exports = {
  about
};
