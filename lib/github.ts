import { Octokit } from 'octokit'

export async function getGitHubUserData(username: string) {
  const octokit = new Octokit({auth: process.env.NEXT_PUBLIC_GITHUB_API_KEY})

  try {
    const { data: user } = await octokit.rest.users.getByUsername({
      username,
    })

    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 5,
    })

    return {
      avatar_url: user.avatar_url,
      name: user.name,
      bio: user.bio,
      location: user.location,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      recent_repos: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        url: repo.html_url,
      })),
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    return null
  }
}