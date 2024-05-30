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
import { addBookmark, getBookmarks } from '../../lib/appwrite'

export default function Bookmark() {
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser, setIsLogged, isLogged } = useGlobalContext();
  const [bookmarks, setBookmarks] = useState([])

  const { data, refetch } = useAppwrite(() => getBookmarks(user.$id));

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }


  useEffect(() => {
    if (data.documents) {
      if (data.documents.length >= 1) {
        const booksIds = data.documents.map(e => e.$id)
        const bookmarksVideo = data.documents.map((e => e.videos))

        const bookmarksData = bookmarksVideo.map((e, i) => Object.assign(e, { bookmarkId: booksIds[i] }))


        setBookmarks(bookmarksData)
      }
    }

  }, [data])

  return (
    <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item, index) => { return index.toString(); }}
        renderItem={({ item }) => (
          <VideoCard
            key={item.$id}
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            videoId={item.$id}
            bookmarkId={item.bookmarkId}
          />
        )}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6 mt-3'>
              <View>
                <Text className='font-psemibold text-2xl text-white'>
                  Saved Videos
                </Text>
              </View>
            </View>

            <SearchInput placeholder='Search your saved videos' />
          </View>
        )}
        ListEmptyComponent={() => (<EmpyState title='No videos saved' image={false} subtitle='Save your videos, you idiot.' />)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}