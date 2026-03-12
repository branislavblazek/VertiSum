function getUrl(id) {
    return `https://www.strava.com/api/v3/activities/${id}`;
}

export default async function getActivity(activityId, token) {
    const response = await fetch(getUrl(activityId), {
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    const activityData = await activityResponse.json();

    return activityData;
}

export default async function updateActivity(activityId, token, description) {
    const response = await fetch(getUrl(activityId), {
        method: 'PUT',
        headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    });

    return response;
}