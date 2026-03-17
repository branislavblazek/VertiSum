function getUrl(id) {
  return `https://www.strava.com/api/v3/activities/${id}`;
}

export async function getActivity(activityId, token) {
  const response = await fetch(getUrl(activityId), {
    headers: { Authorization: `Bearer ${token}` },
  });

  const activityData = await response.json();

  return activityData;
}

async function getActivities(token, page, after) {
  console.log(`Fetching activities, page: ${page}, after: ${after}`);
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?after=${after}&page=${page}&per_page=200`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  const activitiesData = await response.json();

  return activitiesData;
}

export async function updateActivity(activityId, token, description) {
  const response = await fetch(getUrl(activityId), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  return response;
}

export async function getElevationFromActivities(token, allowedTypes) {
  const currentYear = new Date().getFullYear();
  const firstDate = new Date(currentYear, 0, 1);
  const afterTimestamp = Math.floor(firstDate.getTime() / 1000);

  let elevation = 0;
  let page = 1;
  let keepFetching = true;

  while (keepFetching) {
    const activities = await getActivities(token, page, afterTimestamp);

    if (activities.length < 200) {
      keepFetching = false;
    } else {
      page++;
    }

    for (const activity of activities) {
      if (allowedTypes.includes(activity.sport_type)) {
        elevation += activity.total_elevation_gain || 0;
      }
    }
  }

  elevation = Math.round(elevation);

  return elevation;
}
