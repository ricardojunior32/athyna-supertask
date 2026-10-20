import { describe, expect, it } from 'vitest'
import { SkillsSource, TechSkill } from '../../types/skills'
import {
  extractSkills,
  matchesSkills,
  pinSkills,
  readTechSkills,
  resolveSkills,
} from '../skills'

describe('extractSkills', () => {
  it('returns nothing without a description', () => {
    expect(extractSkills(null)).toEqual([])
    expect(extractSkills('')).toEqual([])
  })

  it('returns nothing for a posting that names no technology', () => {
    const description =
      'Performs senior-level reviews of land development plans. React to site incidents quickly and go above and beyond for applicants.'
    expect(extractSkills(description)).toEqual([])
  })

  it('ranks by number of mentions, then by first appearance', () => {
    const description =
      'We build with **React, TypeScript, HTML, and CSS**. Strong TypeScript skills are a must, and our APIs run on Python. More TypeScript, more Python.'
    expect(extractSkills(description)).toEqual(['TypeScript', 'Python', 'React', 'HTML', 'CSS'])
  })

  it('respects the limit', () => {
    expect(extractSkills('Python, Django, TypeScript, React and AWS', 3)).toEqual([
      'Python',
      'Django',
      'TypeScript',
    ])
  })

  it('reports each technology under one name, whatever the spelling', () => {
    expect(extractSkills('nodejs, Node.js and NODE JS')).toEqual(['Node.js'])
    expect(extractSkills('Postgres or PostgreSQL')).toEqual(['PostgreSQL'])
    expect(extractSkills('k8s (Kubernetes)')).toEqual(['Kubernetes'])
    expect(extractSkills('SpringBoot services')).toEqual(['Spring Boot'])
  })

  it('does not find a short name inside a longer one', () => {
    expect(extractSkills('JavaScript')).toEqual(['JavaScript'])
    expect(extractSkills('React Native apps')).toEqual(['React Native'])
    expect(extractSkills('SQL Server and NoSQL stores')).toEqual(['SQL Server', 'NoSQL'])
    expect(extractSkills('AngularJS')).toEqual(['AngularJS'])
  })

  it('handles names with punctuation', () => {
    expect(extractSkills('C#, C++ and .NET. We also use ASP.NET.')).toEqual(['.NET', 'C#', 'C++'])
    expect(extractSkills('Experience with Java.')).toEqual(['Java'])
  })

  it('ignores ordinary words that are also technology names', () => {
    expect(extractSkills('Go the extra mile. Spark new ideas. A swift response.')).toEqual([])
    expect(extractSkills('At the helm of a SWIFT payments team, express yourself.')).toEqual([])
    expect(extractSkills('React to alerts. React quickly to outages.')).toEqual([])
  })

  it('accepts those words inside a list of technologies', () => {
    expect(extractSkills('Python, Go, or Rust')).toEqual(['Python', 'Go', 'Rust'])
    expect(extractSkills('streaming (Kafka/Spark)')).toEqual(['Kafka', 'Spark'])
    expect(extractSkills('Jenkins, Helm, Ansible')).toEqual(['Jenkins', 'Helm', 'Ansible'])
  })

  it('ignores link targets and e-mail addresses', () => {
    const description =
      'We interview with [Spark Hire](https://www.sparkhire.com/java/react). Write to jobs@oracle.com or see www.salesforce.com.'
    expect(extractSkills(description)).toEqual([])
  })
})

describe('resolveSkills', () => {
  it('prefers the skills the API lists', () => {
    const job = { skills: [' Vue ', 'Vue', ''], description: 'We use React and Python.' }
    expect(resolveSkills(job)).toEqual({ skills: ['Vue'], source: SkillsSource.Api })
  })

  it('falls back to the description, capped', () => {
    const job = { skills: [], description: 'Python, Django, TypeScript, React, React Native, and AWS' }
    expect(resolveSkills(job)).toEqual({
      skills: ['Python', 'Django', 'TypeScript', 'React'],
      source: SkillsSource.Derived,
    })
  })

  it('reports when there is nothing to show', () => {
    expect(resolveSkills({ skills: [], description: null })).toEqual({ skills: [], source: SkillsSource.None })
  })
})

describe('skills filter', () => {
  const description =
    'We use Python and SQL every day, Python for pipelines and SQL for reports. Some React on the side.'

  it('matches any selected skill in the API list or the description', () => {
    expect(matchesSkills({ skills: [], description }, [TechSkill.React])).toBe(true)
    expect(matchesSkills({ skills: [], description }, [TechSkill.Java, TechSkill.Sql])).toBe(true)
    expect(matchesSkills({ skills: [], description }, [TechSkill.Java])).toBe(false)
    expect(matchesSkills({ skills: [' Docker'], description: null }, [TechSkill.Docker])).toBe(true)
    expect(matchesSkills({ skills: [], description: null }, [])).toBe(true)
  })

  it('shows a filtered skill first, even when it is mentioned least', () => {
    const { skills } = resolveSkills({ skills: [], description }, 2, [TechSkill.React])
    expect(skills).toEqual(['React', 'Python'])
  })

  it('pins skills without changing the order of the rest', () => {
    expect(pinSkills(['Python', 'SQL', 'React'], ['react'])).toEqual(['React', 'Python', 'SQL'])
    expect(pinSkills(['Python', 'SQL'], [])).toEqual(['Python', 'SQL'])
  })

  it('reads the URL value in the filter order and drops unknown names', () => {
    expect(readTechSkills('react,PYTHON,cobol')).toEqual([TechSkill.Python, TechSkill.React])
    expect(readTechSkills(null)).toEqual([])
  })
})
