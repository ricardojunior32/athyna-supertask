/** The technologies offered as a filter. Values match the names in the skills dictionary. */
export enum TechSkill {
  Python = 'Python',
  Aws = 'AWS',
  Sql = 'SQL',
  Azure = 'Azure',
  Java = 'Java',
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  React = 'React',
  Kubernetes = 'Kubernetes',
  Docker = 'Docker',
}

export enum SkillsSource {
  Api = 'api',
  Derived = 'derived',
  None = 'none',
}

export type Skill = {
  name: string
  patterns: RegExp[]
}

export type SkillMatch = {
  name: string
  mentions: number
  firstIndex: number
}

export type ResolvedSkills = {
  skills: string[]
  source: SkillsSource
}
