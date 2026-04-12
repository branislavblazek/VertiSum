import {
  getActivity,
  getElevationFromActivities,
  updateActivity,
} from "../activity.js";
import getAccessToken from "../auth.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    const verifyToken = process.env.VERIFY_TOKEN;

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        return res.json({ "hub.challenge": challenge });
      }
    }

    return res.status(403).send("Forbidden\n");
  }

  if (req.method === "POST") {
    const allowedTypes = ["Run", "TrailRun", "Hike", "Walk"];
    const { aspect_type, object_type, object_id, owner_id } = req.body;

    if (aspect_type !== "create" || object_type !== "activity") {
      return res.status(200).send("Ignore\n");
    }

    const token = await getAccessToken();

    const activity = await getActivity(object_id, token);

    if (!allowedTypes.includes(activity.sport_type)) {
      return res.status(200).send("Ignore\n");
    }

    const elevation = await getElevationFromActivities(token, allowedTypes);

    const formatted = `${elevation.toLocaleString("sk-SK")} m`;
    const vertiSumLine = `⛰️📈 ${formatted} | generované cez VertiSum`;

    const existingDescription = (activity.description || "")
      .split("\n")
      .filter((line) => !line.includes("| generované cez VertiSum"))
      .join("\n")
      .trim();

    const description = existingDescription
      ? `${existingDescription}\n${vertiSumLine}`
      : vertiSumLine;

    await updateActivity(object_id, token, description);

    return res.status(200).send("OK\n");
  }
}
