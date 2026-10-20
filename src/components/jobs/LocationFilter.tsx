import { MapPin } from 'lucide-react'
import { COUNTRIES, REGIONS } from '../../constants/locations'
import {
  groupLocations,
  regionSelection,
  toggleCountry,
  toggleRegion,
} from '../../lib/location'
import type { LocationFilterProps } from '../../types/components/jobs'
import { Region } from '../../types/location'
import { CheckboxOption } from '../ui/CheckboxOption'
import { Popover } from '../ui/Popover'

export const LocationFilter = ({ value, onChange }: LocationFilterProps) => {
  const groups = groupLocations(value)
  const label =
    groups.length === 0
      ? 'Location'
      : groups.length === 1
        ? groups[0].label
        : `${groups.length} locations`

  return (
    <Popover
      label={
        <>
          <MapPin aria-hidden />
          {label}
        </>
      }
      active={value.length > 0}
      width={264}
    >
      {() => (
        <div className="flex flex-col">
          <div className="max-h-80 overflow-y-auto overscroll-contain">
            {Object.values(Region).map((region) => {
              const { checked, indeterminate } = regionSelection(region, value)
              return (
                <div key={region} role="group" aria-label={REGIONS[region].name}>
                  <CheckboxOption
                    label={REGIONS[region].name}
                    checked={checked}
                    indeterminate={indeterminate}
                    onToggle={() => onChange(toggleRegion(region, value))}
                    className="font-medium"
                  />
                  {REGIONS[region].countries.map((country) => (
                    <CheckboxOption
                      key={country}
                      label={COUNTRIES[country].name}
                      checked={value.includes(country)}
                      onToggle={() => onChange(toggleCountry(country, value))}
                      className="pl-9"
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </Popover>
  )
}
