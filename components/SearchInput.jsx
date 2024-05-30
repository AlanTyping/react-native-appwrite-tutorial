import { View, Alert, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'

import { icons } from '../constants'
import { usePathname, router } from 'expo-router'

export default function SearchInput({initialQuery, placeholder}) {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');

  return (
    <View className='border-2 mb-4 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
      <TextInput
        className="flex-1 text-white font-psemibold text-base h-full w-full"
        value={query}
        placeholder={placeholder}
        placeholderTextColor="#cdcde0"
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if(!query) {
            return Alert.alert('Missing query', "Please input something to search results across the database.")
          }

          if(pathname.startsWith('/search')) router.setParams({ query })
          else router.push(`/search/${query}`)
        }}
      >
        <Image source={icons.search} className='w-5 h-5' reziseMode='contain' />
      </TouchableOpacity>
    </View>
  )
}