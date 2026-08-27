/**
 * Fallback estático — en producción se actualiza vía /api/github-stats.
 * Regenerar: pnpm stats:github
 */
export const githubUsageSnapshot = {
    "updatedAt": "2026-08-27",
    "source": "github",
    "login": "betuko37",
    "name": "Jesús Alberto Zavala",
    "publicRepos": 27,
    "privateRepos": 17,
    "totalRepos": 45,
    "followers": 10,
    "memberSince": "2023-01",
    "authenticated": true,
    "reposScanned": 45,
    "reposWithLanguages": 44,
    "totalBytes": 44,
    "languages": [
      {
        "label": "JavaScript",
        "bytes": 27
      },
      {
        "label": "TypeScript",
        "bytes": 10
      },
      {
        "label": "Dart",
        "bytes": 3
      },
      {
        "label": "Python",
        "bytes": 1
      },
      {
        "label": "C++",
        "bytes": 1
      },
      {
        "label": "PHP",
        "bytes": 1
      },
      {
        "label": "Shell",
        "bytes": 1
      }
    ],
    "technologies": [
      {
        "label": "React",
        "bytes": 21
      },
      {
        "label": "Express",
        "bytes": 14
      },
      {
        "label": "Flutter",
        "bytes": 5
      },
      {
        "label": "Node.js",
        "bytes": 2
      },
      {
        "label": "Vue",
        "bytes": 1
      },
      {
        "label": "Tailwind",
        "bytes": 1
      }
    ],
    "layers": [
      {
        "label": "Frontend",
        "bytes": 24
      },
      {
        "label": "Backend",
        "bytes": 16
      },
      {
        "label": "Mobile",
        "bytes": 4
      }
    ]
  } as const;

export type GithubUsageSnapshot = typeof githubUsageSnapshot;
