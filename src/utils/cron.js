const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const {subDays, startOfDay, endOfDay} = require("date-fns")
const sendEmail = require("./sendEmail")

cron.schedule("30 0 * * *", async()=> {
    // Send emails to all people who got requests the previous day

    try {

        const yesterday = subDays(new Date(), 0);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            }
        }).populate("fromUserId toUserId");

        const listOfEmails = [...new Set(pendingRequests.map(req => req.toUserId.emailId))]
        
        console.log(listOfEmails)
        for(const email of listOfEmails){
            try {
                 // Send Emails
                 const res = await sendEmail.run("New Friend Request pending for " + email, "There are so many friend request pending, please login")
                 console.log(res);
            } 
        
            catch (error) {
                console.log(error);
            }
        }

    } catch (error) {
        console.log(error);
    }
    console.log("Hello world, " + new Date());
})