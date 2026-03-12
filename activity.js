export default async function updateActivity(activityId, token, description) {
    const url = `https://www.strava.com/api/v3/activities/${activityId}`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description })
    });

    return response;
}