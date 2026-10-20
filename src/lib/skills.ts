import type { Job } from '../types/job'
import {
  type ResolvedSkills,
  type Skill,
  type SkillMatch,
  SkillsSource,
  TechSkill,
} from '../types/skills'
import { formatSkills } from './format'

const START = String.raw`(?<![\w.@])`
const END = String.raw`(?![\w+#]|\.\w)`

const toSource = (term: string): string => {
  return term
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/ /g, '[\\s-]?')
}

const build = (terms: string[], flags: string, wrap = (source: string) => source): RegExp => {
  return new RegExp(wrap(`${START}(?:${terms.map(toSource).join('|')})${END}`), flags)
}

const anyCase = (...terms: string[]) => build(terms, 'gi')

const exact = (...terms: string[]) => build(terms, 'g')

const listed = (...terms: string[]) =>
  build(terms, 'g', (source) => `(?<=[,/(]\\s?)${source}|${source}(?=\\s?[,/)])`)

const skill = (name: string, ...patterns: RegExp[]): Skill => ({
  name,
  patterns: patterns.length > 0 ? patterns : [anyCase(name)],
})

const SKILLS: Skill[] = [
  skill('TypeScript'),
  skill('JavaScript'),
  skill('Python'),
  skill('Java'),
  skill('C#'),
  skill('C++'),
  skill('Go', anyCase('Golang'), listed('Go')),
  skill('Rust', exact('Rust')),
  skill('Ruby on Rails', anyCase('Ruby on Rails'), exact('Rails')),
  skill('Ruby', exact('Ruby')),
  skill('PHP', exact('PHP')),
  skill('Kotlin'),
  skill('Objective-C'),
  skill('Swift', exact('Swift', 'SwiftUI')),
  skill('Scala', exact('Scala')),
  skill('Elixir', exact('Elixir')),
  skill('Perl', exact('Perl')),
  skill('COBOL'),
  skill('MATLAB'),
  skill('Bash', exact('Bash')),
  skill('PowerShell'),

  skill('React Native'),
  skill(
    'React',
    anyCase('React.js', 'ReactJS'),
    build(['React'], 'g', (source) => `${source}(?!\\s+(?:to|quickly|promptly|appropriately)\\b)`),
  ),
  skill('Next.js', anyCase('Next.js', 'NextJS')),
  skill('Nuxt', anyCase('Nuxt', 'Nuxt.js')),
  skill('Vue', anyCase('Vue.js', 'VueJS'), exact('Vue')),
  skill('AngularJS', anyCase('AngularJS', 'Angular.js')),
  skill('Angular', exact('Angular')),
  skill('Svelte', anyCase('Svelte', 'SvelteKit')),
  skill('Redux', exact('Redux')),
  skill('jQuery'),
  skill('Tailwind CSS', anyCase('Tailwind CSS', 'Tailwind')),
  skill('Sass', exact('Sass', 'SASS', 'SCSS')),
  skill('HTML', anyCase('HTML', 'HTML5')),
  skill('CSS', anyCase('CSS', 'CSS3')),
  skill('Flutter', exact('Flutter')),
  skill('iOS', exact('iOS')),
  skill('Android', exact('Android')),

  skill('Node.js', anyCase('Node.js', 'NodeJS', 'Node JS'), listed('Node')),
  skill('NestJS', anyCase('NestJS', 'Nest.js')),
  skill('Express', anyCase('Express.js', 'ExpressJS')),
  skill('Django', exact('Django')),
  skill('Flask', listed('Flask')),
  skill('FastAPI'),
  skill('Spring Boot', anyCase('Spring Boot', 'Spring Framework', 'Spring MVC')),
  skill('Laravel'),
  skill('.NET', anyCase('ASP.NET', '.NET', 'dotnet')),
  skill('GraphQL'),
  skill('gRPC'),

  skill('SQL Server', anyCase('SQL Server', 'MSSQL', 'T-SQL')),
  skill('PostgreSQL', anyCase('PostgreSQL', 'Postgres')),
  skill('MySQL'),
  skill('NoSQL'),
  skill('SQL', exact('SQL')),
  skill('MongoDB', anyCase('MongoDB', 'Mongo')),
  skill('Redis', exact('Redis')),
  skill('Elasticsearch', anyCase('Elasticsearch', 'Elastic Search')),
  skill('DynamoDB'),
  skill('Cassandra', exact('Cassandra')),
  skill('Oracle', exact('Oracle')),
  skill('Kafka', exact('Kafka')),
  skill('RabbitMQ'),

  skill('Spark', anyCase('Apache Spark', 'PySpark', 'Spark SQL', 'Spark Streaming'), listed('Spark')),
  skill('Hadoop'),
  skill('Airflow', exact('Airflow')),
  skill('dbt', exact('dbt')),
  skill('Snowflake', exact('Snowflake')),
  skill('Databricks'),
  skill('BigQuery'),
  skill('Redshift', exact('Redshift')),
  skill('Pandas', exact('Pandas', 'pandas')),
  skill('NumPy'),
  skill('PyTorch'),
  skill('TensorFlow'),
  skill('scikit-learn', anyCase('scikit-learn', 'sklearn')),
  skill('Tableau', exact('Tableau')),
  skill('Power BI', anyCase('Power BI')),
  skill('Looker', exact('Looker')),

  skill('AWS', exact('AWS'), anyCase('Amazon Web Services')),
  skill('Azure', exact('Azure')),
  skill('GCP', exact('GCP'), anyCase('Google Cloud Platform', 'Google Cloud')),
  skill('Kubernetes', anyCase('Kubernetes', 'k8s')),
  skill('Docker', exact('Docker')),
  skill('Terraform'),
  skill('Ansible', exact('Ansible')),
  skill('Helm', listed('Helm')),
  skill('Jenkins', exact('Jenkins')),
  skill('GitHub Actions'),
  skill('GitLab', anyCase('GitLab', 'GitLab CI')),
  skill('OpenShift'),
  skill('Linux', exact('Linux')),
  skill('VMware'),
  skill('Nginx'),
  skill('Prometheus', exact('Prometheus')),
  skill('Grafana'),
  skill('Datadog'),
  skill('Splunk', exact('Splunk')),

  skill('Selenium', exact('Selenium')),
  skill('Cypress', listed('Cypress')),
  skill('Playwright', exact('Playwright')),
  skill('Jest', exact('Jest')),

  skill('Salesforce', exact('Salesforce')),
  skill('ServiceNow'),
  skill('SAP', exact('SAP')),
  skill('SharePoint'),
  skill('Figma', exact('Figma')),
]

const NOT_PROSE = /\bhttps?:\/\/[^\s)>\]]+|\bwww\.[^\s)>\]]+|\S+@\S+/gi

const blank = (match: string) => ' '.repeat(match.length)

export const extractSkills = (description: string | null | undefined, limit = Infinity): string[] => {
  if (!description) return []

  let text = description.replace(NOT_PROSE, blank)
  const found: SkillMatch[] = []

  for (const { name, patterns } of SKILLS) {
    let mentions = 0
    let firstIndex = Infinity
    for (const pattern of patterns) {
      text = text.replace(pattern, (match: string, index: number) => {
        mentions += 1
        firstIndex = Math.min(firstIndex, index)
        return blank(match)
      })
    }
    if (mentions > 0) found.push({ name, mentions, firstIndex })
  }

  return found
    .sort((a, b) => b.mentions - a.mentions || a.firstIndex - b.firstIndex)
    .slice(0, limit)
    .map(({ name }) => name)
}

/** Moves the pinned skills to the front, keeping the rest in their order. */
export const pinSkills = (skills: string[], pinned: readonly string[]): string[] => {
  if (pinned.length === 0) return skills
  const wanted = new Set(pinned.map((skill) => skill.toLowerCase()))
  const isPinned = (skill: string) => wanted.has(skill.toLowerCase())
  return [...skills.filter(isPinned), ...skills.filter((skill) => !isPinned(skill))]
}

/**
 * Skills to show for a job: the API's list when it has one, otherwise the most mentioned ones in
 * the description. Pinned skills (the ones being filtered by) come first, so a filtered row always
 * shows why it matched.
 */
export const resolveSkills = (
  job: Pick<Job, 'skills' | 'description'>,
  derivedLimit = 4,
  pinned: readonly string[] = [],
): ResolvedSkills => {
  const listedByApi = formatSkills(job.skills)
  if (listedByApi.length > 0) {
    return { skills: pinSkills(listedByApi, pinned), source: SkillsSource.Api }
  }

  const derived = pinSkills(
    extractSkills(job.description, pinned.length > 0 ? Infinity : derivedLimit),
    pinned,
  ).slice(0, derivedLimit)
  return { skills: derived, source: derived.length > 0 ? SkillsSource.Derived : SkillsSource.None }
}

/** True when the job lists or mentions any of the skills, in its API skills or its description. */
export const matchesSkills = (
  job: Pick<Job, 'skills' | 'description'>,
  selected: readonly TechSkill[],
): boolean => {
  if (selected.length === 0) return true
  const listedByApi = formatSkills(job.skills)
  const skills = listedByApi.length > 0 ? listedByApi : extractSkills(job.description)
  const found = new Set(skills.map((skill) => skill.toLowerCase()))
  return selected.some((skill) => found.has(skill.toLowerCase()))
}

/** Reads `skills=Python,React`, keeping the filter's order and dropping unknown names. */
export const readTechSkills = (value: string | null): TechSkill[] => {
  if (!value) return []
  const wanted = new Set(value.split(',').map((skill) => skill.trim().toLowerCase()))
  return Object.values(TechSkill).filter((skill) => wanted.has(skill.toLowerCase()))
}
