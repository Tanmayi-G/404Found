const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");

//Send email reminder at 9 AM every morning to all the people who got a request the previous day
cron.schedule("0 9 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [...new Set(pendingRequests.map((req) => req.toUserId.emailId))];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      try {
        const res = await sendEmail.run("You have pending friend requests!", `Hi ${email}! You have some pending friend requests from yesterday! Login to 404found.live to review them.`);
        console.log(res);
      } catch (err) {}
    }
  } catch (err) {
    console.error(err);
  }
});
