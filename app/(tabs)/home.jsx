import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect } from 'react'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmpyState from '../../components/EmpyState'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/globalProvider'

const Home = () => {

  const { user, setUser, setIsLogged, isLogged } = useGlobalContext();
  const { data: posts, refetch, isLoading } = useAppwrite(getAllPosts);
  const { data: latestVideos } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }
  
  return (
    <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
      <FlatList
        data={posts}
        keyExtractor={(item, index) => { return  index.toString(); }}
        renderItem={({ item }) => (
          <VideoCard
            key={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            videoId={item.$id}
          />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pdemium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='font-psemibold text-2xl text-white'>
                  {user?.username}
                </Text>
              </View>
              <View className='mt-1.5'>
                <Image source={images.logoSmall} className='w-9 h-10' reziseMode='contain' />
              </View>
            </View>

            <SearchInput placeholder='Search interesting videos' />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestVideos ?? []} />
            </View>
          </View>
        )}
        ListEmpyComponent={() => (<EmpyState title='No videos found' subtitle='Be the first one to upload a video' />)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Home