import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'

import { icons } from '../constants'

export default function FormField({ title, value, placeholder, handleChangeText, otherStyles, ...props }) {
    const [showPassword, setShowPassword] = useState(false)

    return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row'>
        <TextInput
            className="flex-1 text-white font-psemibold text-base h-full w-full"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() =>
            setShowPassword(!showPassword)}>
                <Image className="w-6 h-6" reziseMode='contain' source={!showPassword ? icons.eye : icons.eyeHide} /> 
            </TouchableOpacity>
        )}
      </View> 
    </View>
  )
}