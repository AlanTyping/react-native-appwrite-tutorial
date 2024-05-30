import { View, Image, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import EmptyState from '../../components/EmpyState'
import { getUserPosts, signOut, uploadProfileImage } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { router, Redirect } from 'expo-router'
import { useGlobalContext } from '../../context/globalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'

const Profile = () => {
  const { user, setUser, setIsLogged, isLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getUserPosts(user.$id));

  const [refreshing, setRefreshing] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLogged(false)

    router.replace('/sign-in')
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'black', height: '100%' }}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
            <TouchableOpacity className='w-full items-end mb-10' onPress={logout}>
              <Image
                source={icons.logout}
                resizeMode='contain'
                className='w-6 h-6'
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => uploadProfileImage('https://cloud.appwrite.io/v1/storage/buckets/664b8ee800253f80d68d/files/66576e2e0036ee64e858/view?project=664b89b9000e081a8569&mode=admin')}>
              <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                <Image source={{ uri: user?.avatar }} className='w-[90%] h-[90%] ronded-lg' resizeMode='contain' />
              </View>
            </TouchableOpacity>

            <InfoBox
              title={user?.username}
              containerStyles='mt-5'
              titleStyles='text-lg'
            />

            <View className='mt-5 flex-row'>
              <InfoBox
                title={posts.length || 0}
                subtitle='Posts'
                containerStyles='mr-10'
                titleStyles='text-xl'
              />
              <InfoBox
                title='1.2k'
                subtitle='Followers'
                titleStyles='text-xl'
              />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this search query"
            video={true}
          />
        )}
      />
    </SafeAreaView>
  )
}

export default Profile