export async function fetchSummonerData(name: string, tag: string) {
  if (!process.env.RIOT_API_KEY) {
    throw new Error('Riot API key not found. Check .env.local')
  }

  const response = await fetch(
    `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}/?api_key=${process.env.RIOT_API_KEY}`
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch summoner data: HTTP ${response.status}`)
  }

  return response.json()
}
