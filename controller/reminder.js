import dotenv from "dotenv";
import  twilio  from "twilio";

dotenv.config();

const twiliosid = process.env.TWILI_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_ACCOUNT_PASSWORD;

const client = twilio(twiliosid, twilioToken);
export const addReminder = async (req, res) => {
  try {
    const { message, to } = req.body;
    const sendMessage = await client.messages.create({
        from: '+12316748610',
        // messagingServiceSid:"VAd98afb06123b68660589b2218234dcb7",
      to: `${to}`,
      body: message,
    });
    res.status(200).json({
      message: "message send successfully",
      sid: sendMessage.sid,
    });
  } catch (error) {
    res.status(500).json({
        message:"error",
        error
    });

    console.log(error)
  }
};
