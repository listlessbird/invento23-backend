const sgMail = require("@sendgrid/mail");
const fs = require("fs").promises;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const mailHelper = async (order, event) => {
  console.log("inside mail helper");
  const { email, name } = order;
  const {
    name: eventName,
    category,
    date,
    contactName,
    contactNumber,
    time,
  } = event;

  console.log("time: ",time)

  //converting date to readable format : month date
  const options = { month: "long", day: "numeric" };
  const dateString = date.toLocaleDateString("en-US", options);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;

  console.log("formatted time: ",formattedTime)

  let competition, workshop;

  if (category == "competitions") {
    const {rules} = event
    let rulesHtml = "";

    for (let i =0 ; i < rules.length; i++) {
      rulesHtml += `<li>${rules[i]}</li>`
    }

    try {
      // Read HTML template file
      competition = await fs.readFile(
        __dirname + "/templates/competition.html",
        "utf-8"
      );
      console.log("html file read successful");
    } catch (error) {
      console.error("Error reading HTML template file:", error);
      return "error";
    }
    const messageHtml = competition
      .replace("{name}", name)
      .replace("{date}", dateString)
      .replace("{eventName}", eventName)
      .replace("{time}",formattedTime)
      .replace("{contactNumber}",contactNumber)
      .replace("{rules}", rulesHtml); 



    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Confirmation of Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    };

    try {
      await sgMail.send(message);
      console.log("email sent");
    } catch (error) {
      console.log(error);
    }
  }

  if (category == "workshops") {
    try {
      // Read HTML template file
      workshop = await fs.readFile(
        __dirname + "/templates/workshop.html",
        "utf-8"
      );
      console.log("html file read successful");
    } catch (error) {
      console.error("Error reading HTML template file:", error);
      return "error";
    }
    const messageHtml = workshop
      .replace("{name}", name)
      .replace("{date}", dateString)
      .replace("{eventName}", eventName)
      .replace("{time}",formattedTime)
      .replace("{contactName}",contactName)
      .replace("{contactNumber}",contactNumber);



    // Send email with the modified HTML template
    const message = {
      to: email,
      from: {
        name: "Invento",
        email: process.env.EMAIL,
      },
      subject: `Confirmation of Registration: ${eventName} at INVENTO'23 - ${dateString} - Government Engineering College Palakkad`,
      html: messageHtml,
    };

    try {
      await sgMail.send(message);
      console.log("email sent");
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = mailHelper;
