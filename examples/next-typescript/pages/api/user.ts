import withSession from "../../lib/session";
import { User } from "../../lib/user";

export default withSession(async (req, res) => {
  const user: User = req.session.get("user");

  if (user) {
    // in a real world application you might read the user id from the session and then do a database request
    // to get more information on the user if needed
    res.json({
      isLoggedIn: true,
      ...user,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
});
