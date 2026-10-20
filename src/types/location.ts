export enum Region {
  NorthAmerica = 'north-america',
  Latam = 'latam',
  Europe = 'europe',
  MiddleEast = 'middle-east',
  Africa = 'africa',
  Apac = 'apac',
}

export enum Country {
  UnitedStates = 'US',
  Canada = 'CA',
  Argentina = 'AR',
  Brazil = 'BR',
  Chile = 'CL',
  Colombia = 'CO',
  Mexico = 'MX',
  Peru = 'PE',
  Uruguay = 'UY',
  Venezuela = 'VE',
  France = 'FR',
  Germany = 'DE',
  Ireland = 'IE',
  Italy = 'IT',
  Netherlands = 'NL',
  Poland = 'PL',
  Portugal = 'PT',
  Romania = 'RO',
  Spain = 'ES',
  Sweden = 'SE',
  Ukraine = 'UA',
  UnitedKingdom = 'GB',
  Israel = 'IL',
  SaudiArabia = 'SA',
  Turkey = 'TR',
  UnitedArabEmirates = 'AE',
  Egypt = 'EG',
  Ghana = 'GH',
  Kenya = 'KE',
  Nigeria = 'NG',
  SouthAfrica = 'ZA',
  Australia = 'AU',
  India = 'IN',
  Indonesia = 'ID',
  Malaysia = 'MY',
  NewZealand = 'NZ',
  Pakistan = 'PK',
  Philippines = 'PH',
  Singapore = 'SG',
  SouthKorea = 'KR',
  Vietnam = 'VN',
}

export type CountryDefinition = {
  name: string
  /** Lowercase names, spellings and big cities that identify the country in free text. */
  aliases: readonly string[]
  /** Uppercase codes that identify the country, matched case-sensitively. */
  codes: readonly string[]
}

export type RegionDefinition = {
  name: string
  countries: readonly Country[]
}

export type RegionSelection = {
  checked: boolean
  indeterminate: boolean
}

/** A whole region or a single country, as shown in filter tags and written to the URL. */
export type LocationGroup = {
  value: string
  label: string
  countries: readonly Country[]
}
