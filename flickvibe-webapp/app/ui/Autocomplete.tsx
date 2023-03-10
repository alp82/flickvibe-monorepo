import React, { ReactNode, useEffect, useState } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { Combobox } from '@headlessui/react'
import { classNames } from '~/utils/helpers'

export interface AutocompleteItem {
  key: string
  label: string
}

export interface RenderItemParams<RenderItem extends AutocompleteItem> {
  item: RenderItem
  active: boolean
  selected: boolean
  disabled: boolean
}

export interface AutocompleteProps<RenderItem extends AutocompleteItem> {
  name: string
  placeholder: string
  icon: ReactNode
  autocompleteItems: RenderItem[]
  renderItem: (renderItemParams: RenderItemParams<RenderItem>) => ReactNode
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSelect: (selectedItem: RenderItem) => void
}

export default function Autocomplete<RenderItem extends AutocompleteItem>({
  name,
  placeholder,
  icon,
  autocompleteItems,
  renderItem,
  onChange,
  onSelect,
}: AutocompleteProps<RenderItem>) {
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (!selectedItem) return
    onSelect(selectedItem)
  }, [selectedItem])

  return (
    <Combobox as="div" value={selectedItem} onChange={setSelectedItem}>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon}
        </div>
        <Combobox.Input
          className="block w-full rounded-md border border-transparent bg-gray-700 py-2 pl-10 pr-3 leading-5 text-gray-300 placeholder-gray-400 focus:border-gray-400 focus:bg-slate-700 focus:text-gray-100 focus:outline-none focus:ring-gray-400 sm:text-sm"
          name={name}
          placeholder={placeholder}
          displayValue={(item: AutocompleteItem) => item?.label}
          onChange={onChange}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {autocompleteItems?.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {autocompleteItems.map((item) => (
              <Combobox.Option
                key={item.key}
                value={item}
                className={({ active }) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({ active, selected, disabled }) => (
                  <>
                    <div className="flex items-center">
                      {renderItem({ item, active, selected, disabled })}
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  )
}