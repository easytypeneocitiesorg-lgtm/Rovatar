export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "No username provided" });
  }

  try {
    // Username → UserId
    const userRes = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: false
      })
    });

    const userData = await userRes.json();

    if (!userData.data || userData.data.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userData.data[0].id;

    // Avatar thumbnail
    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const thumbData = await thumbRes.json();

    res.status(200).json({
      userId,
      avatar: thumbData.data[0].imageUrl
    });

  } catch (e) {
    res.status(500).json({ error: "Roblox request failed" });
  }
}

