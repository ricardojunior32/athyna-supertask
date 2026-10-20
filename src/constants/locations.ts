import { Country, type CountryDefinition, Region, type RegionDefinition } from '../types/location'

export const LOCATION_HINT =
  "Location is read from each job's location text, since the API can't filter by it. Jobs without a clear country are left out."

export const REGIONS: Record<Region, RegionDefinition> = {
  [Region.NorthAmerica]: {
    name: 'North America',
    countries: [Country.UnitedStates, Country.Canada],
  },
  [Region.Latam]: {
    name: 'LATAM',
    countries: [
      Country.Argentina,
      Country.Brazil,
      Country.Chile,
      Country.Colombia,
      Country.Mexico,
      Country.Peru,
      Country.Uruguay,
      Country.Venezuela,
    ],
  },
  [Region.Europe]: {
    name: 'Europe',
    countries: [
      Country.France,
      Country.Germany,
      Country.Ireland,
      Country.Italy,
      Country.Netherlands,
      Country.Poland,
      Country.Portugal,
      Country.Romania,
      Country.Spain,
      Country.Sweden,
      Country.Ukraine,
      Country.UnitedKingdom,
    ],
  },
  [Region.MiddleEast]: {
    name: 'Middle East',
    countries: [Country.Israel, Country.SaudiArabia, Country.Turkey, Country.UnitedArabEmirates],
  },
  [Region.Africa]: {
    name: 'Africa',
    countries: [Country.Egypt, Country.Ghana, Country.Kenya, Country.Nigeria, Country.SouthAfrica],
  },
  [Region.Apac]: {
    name: 'APAC',
    countries: [
      Country.Australia,
      Country.India,
      Country.Indonesia,
      Country.Malaysia,
      Country.NewZealand,
      Country.Pakistan,
      Country.Philippines,
      Country.Singapore,
      Country.SouthKorea,
      Country.Vietnam,
    ],
  },
}

const US_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas',
  'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey',
  'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
  'pennsylvania', 'rhode island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah',
  'vermont', 'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming',
]

const US_STATE_CODES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
  'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV',
  'WI', 'WY', 'DC',
]

/**
 * How each country shows up in the API's free-text `locality` field. Two-letter codes that are
 * also US state codes (CA, IN, IL, DE, ID, CO, AR) are left out on purpose: in this data they
 * almost always mean the state.
 */
export const COUNTRIES: Record<Country, CountryDefinition> = {
  [Country.UnitedStates]: {
    name: 'United States',
    aliases: [
      'united states', 'united states of america', 'usa', ...US_STATES,
      'san francisco', 'los angeles', 'seattle', 'chicago', 'boston', 'austin', 'denver',
      'atlanta', 'miami', 'dallas', 'houston', 'philadelphia', 'san diego', 'san jose',
      'washington dc', 'district of columbia', 'silicon valley', 'bay area',
    ],
    codes: ['US', 'USA', 'NYC', 'SF', ...US_STATE_CODES],
  },
  [Country.Canada]: {
    name: 'Canada',
    aliases: [
      'canada', 'ontario', 'quebec', 'british columbia', 'alberta', 'manitoba', 'nova scotia',
      'toronto', 'vancouver', 'montreal', 'calgary', 'ottawa', 'edmonton', 'waterloo',
    ],
    codes: ['ON', 'BC', 'QC', 'AB', 'CAN'],
  },
  [Country.Argentina]: {
    name: 'Argentina',
    aliases: ['argentina', 'buenos aires'],
    codes: [],
  },
  [Country.Brazil]: {
    name: 'Brazil',
    aliases: [
      'brazil', 'brasil', 'sao paulo', 'rio de janeiro', 'belo horizonte', 'porto alegre',
      'curitiba', 'florianopolis', 'recife', 'brasilia',
    ],
    codes: ['BR'],
  },
  [Country.Chile]: { name: 'Chile', aliases: ['chile'], codes: [] },
  [Country.Colombia]: {
    name: 'Colombia',
    aliases: ['colombia', 'bogota', 'medellin'],
    codes: [],
  },
  [Country.Mexico]: {
    name: 'Mexico',
    aliases: ['mexico', 'mexico city', 'ciudad de mexico', 'guadalajara', 'monterrey'],
    codes: ['MX'],
  },
  [Country.Peru]: { name: 'Peru', aliases: ['peru'], codes: [] },
  [Country.Uruguay]: { name: 'Uruguay', aliases: ['uruguay', 'montevideo'], codes: [] },
  [Country.Venezuela]: { name: 'Venezuela', aliases: ['venezuela', 'caracas'], codes: [] },
  [Country.France]: { name: 'France', aliases: ['france', 'paris', 'lyon'], codes: ['FR'] },
  [Country.Germany]: {
    name: 'Germany',
    aliases: ['germany', 'deutschland', 'berlin', 'munich', 'munchen', 'hamburg', 'frankfurt'],
    codes: [],
  },
  [Country.Ireland]: { name: 'Ireland', aliases: ['ireland', 'dublin', 'cork'], codes: ['IE', 'IRL'] },
  [Country.Italy]: { name: 'Italy', aliases: ['italy', 'italia', 'milan'], codes: [] },
  [Country.Netherlands]: {
    name: 'Netherlands',
    aliases: ['netherlands', 'the netherlands', 'holland', 'amsterdam', 'rotterdam', 'utrecht'],
    codes: ['NL'],
  },
  [Country.Poland]: {
    name: 'Poland',
    aliases: ['poland', 'polska', 'warsaw', 'krakow', 'wroclaw', 'gdansk'],
    codes: ['PL'],
  },
  [Country.Portugal]: {
    name: 'Portugal',
    aliases: ['portugal', 'lisbon', 'lisboa', 'porto'],
    codes: ['PT'],
  },
  [Country.Romania]: { name: 'Romania', aliases: ['romania', 'bucharest'], codes: ['RO'] },
  [Country.Spain]: {
    name: 'Spain',
    aliases: ['spain', 'espana', 'madrid', 'barcelona'],
    codes: ['ES', 'ESP'],
  },
  [Country.Sweden]: { name: 'Sweden', aliases: ['sweden', 'stockholm'], codes: ['SE'] },
  [Country.Ukraine]: { name: 'Ukraine', aliases: ['ukraine', 'kyiv', 'kiev', 'lviv'], codes: [] },
  [Country.UnitedKingdom]: {
    name: 'United Kingdom',
    aliases: [
      'united kingdom', 'great britain', 'england', 'scotland', 'wales', 'northern ireland',
      'london', 'manchester', 'edinburgh', 'glasgow', 'bristol', 'leeds',
    ],
    codes: ['UK', 'GB', 'GBR'],
  },
  [Country.Israel]: { name: 'Israel', aliases: ['israel', 'tel aviv'], codes: ['ISR'] },
  [Country.SaudiArabia]: {
    name: 'Saudi Arabia',
    aliases: ['saudi arabia', 'riyadh', 'jeddah'],
    codes: ['KSA'],
  },
  [Country.Turkey]: {
    name: 'Turkey',
    aliases: ['turkey', 'turkiye', 'istanbul', 'ankara'],
    codes: [],
  },
  [Country.UnitedArabEmirates]: {
    name: 'UAE',
    aliases: ['united arab emirates', 'dubai', 'abu dhabi'],
    codes: ['UAE'],
  },
  [Country.Egypt]: { name: 'Egypt', aliases: ['egypt', 'cairo'], codes: [] },
  [Country.Ghana]: { name: 'Ghana', aliases: ['ghana', 'accra'], codes: [] },
  [Country.Kenya]: { name: 'Kenya', aliases: ['kenya', 'nairobi'], codes: [] },
  [Country.Nigeria]: { name: 'Nigeria', aliases: ['nigeria', 'lagos', 'abuja'], codes: [] },
  [Country.SouthAfrica]: {
    name: 'South Africa',
    aliases: ['south africa', 'johannesburg', 'cape town'],
    codes: ['ZA'],
  },
  [Country.Australia]: {
    name: 'Australia',
    aliases: [
      'australia', 'new south wales', 'queensland', 'victoria, australia', 'sydney', 'melbourne',
      'brisbane', 'perth', 'adelaide', 'canberra',
    ],
    codes: ['AU', 'NSW', 'QLD', 'VIC'],
  },
  [Country.India]: {
    name: 'India',
    aliases: [
      'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai', 'chennai', 'delhi',
      'new delhi', 'gurgaon', 'gurugram', 'noida', 'kolkata', 'ahmedabad',
    ],
    codes: ['IND'],
  },
  [Country.Indonesia]: { name: 'Indonesia', aliases: ['indonesia', 'jakarta'], codes: [] },
  [Country.Malaysia]: { name: 'Malaysia', aliases: ['malaysia', 'kuala lumpur'], codes: ['MY'] },
  [Country.NewZealand]: {
    name: 'New Zealand',
    aliases: ['new zealand', 'auckland', 'wellington'],
    codes: ['NZ'],
  },
  [Country.Pakistan]: {
    name: 'Pakistan',
    aliases: ['pakistan', 'karachi', 'lahore', 'islamabad'],
    codes: [],
  },
  [Country.Philippines]: {
    name: 'Philippines',
    aliases: ['philippines', 'manila', 'cebu'],
    codes: ['PH'],
  },
  [Country.Singapore]: { name: 'Singapore', aliases: ['singapore'], codes: ['SG'] },
  [Country.SouthKorea]: {
    name: 'South Korea',
    aliases: ['south korea', 'korea', 'seoul'],
    codes: [],
  },
  [Country.Vietnam]: {
    name: 'Vietnam',
    aliases: ['vietnam', 'viet nam', 'ho chi minh', 'hanoi'],
    codes: [],
  },
}
