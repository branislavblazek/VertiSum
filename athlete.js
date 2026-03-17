// NOT USED
export default async function getAthleteStats(athleteId, token) {
  const url = "https://www.strava.com/api/v3/athletes";

  const response = await fetch(`${url}/${athleteId}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const stats = await response.json();

  return stats;
}
