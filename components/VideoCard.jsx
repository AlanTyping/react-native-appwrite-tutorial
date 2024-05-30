import { useState } from "react";
// import { ResizeMode, Video } from "expo-av"; 
import { View, Text, TouchableOpacity, Image, Alert, Modal, StyleSheet, Button } from "react-native";
import useAppwrite from "../lib/useAppwrite";
import { addBookmark, deleteBookmark, getBookmarks } from "../lib/appwrite";

import { icons } from "../constants";
import { useGlobalContext } from "../context/globalProvider";

const VideoCard = ({ title, creator, avatar, thumbnail, videoId, bookmarkId }) => {
  const { user } = useGlobalContext();
  const [play, setPlay] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = async () => {
    await addBookmark(user.$id, videoId)
    setModalVisible(false);
  }

  const handleDelete = async () => {
    setModalVisible(false);
    await deleteBookmark(bookmarkId)
  }

  const handlePress = () => {
    setModalVisible(true);
  }

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creator}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handlePress} className="pt-2 relative">
          <Image source={icons.menu} className="w-5 h-5" resizeMode="contain" />

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                {bookmarkId ?
                  <Button title="Delete bookmark" onPress={handleDelete} /> :
                  <Button title="Add bookmark" onPress={handleAdd} />}

                <Button title="Cerrar Modal" onPress={() => setModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </TouchableOpacity>
      </View>

      {/* {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 rounded-xl mt-3"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : ( */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setPlay(true)}
        className="w-full h-60 rounded-xl mt-3 bg-yellow-800 relative flex justify-center items-center"
      >
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-full rounded-xl mt-3"
          resizeMode="cover"
        />

        <Image
          source={icons.play}
          className="w-12 h-12 absolute"
          resizeMode="contain"
        />
      </TouchableOpacity>
      {/* )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default VideoCard;