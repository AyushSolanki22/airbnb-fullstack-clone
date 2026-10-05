exports.error = (req, res) => {
  //404 error for wrong url
  res
    .status(404)
    .render("404", {
      pageTitle: "Page Not Found",
      currPage: "404",
      isLoggedIn: req.session.isLoggedIn,
      user: req.session.user || {},
    });
};
