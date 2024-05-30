import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
// Init your React Native SDK

const config = {
  endpoint: process.env.EXPO_PUBLIC_ENDPOINT,
  platform: process.env.EXPO_PUBLIC_PLATFORM,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_DATABASE_ID,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID,
  videoCollectionId: process.env.EXPO_PUBLIC_VIDEO_COLLECTION_ID,
  storageId: process.env.EXPO_PUBLIC_STORAGE_ID,
  bookmarkCollectionId: process.env.EXPO_PUBLIC_BOOKMARK_COLLECTION_ID
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
  bookmarkCollectionId
} = config;

const client = new Client()
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform) // Your application ID or bundle ID.
  ;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)



export const uploadProfileImage = async (photoUrl) => {
  try {
    const user = await account.updatePrefs({
      profileImage: photoUrl,
    });
    console.log(user); // Maneja la respuesta según sea necesario
  } catch (error) {
    console.error(error);
  }
}




// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    )

    // account != user

    console.log(newAccount.$id)
    console.log(email)
    console.log(username)

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    console.log(avatarUrl)

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      });

    return newUser;
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);

    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export const savePost = async () => {
  try {
    const result = await databases.getDocument(
      databaseId,
      bookmarkCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )
  } catch (error) {
    throw new Error(error);
  }
}


export const getBookmarks = async (userId) => {
  try {
    const userBookmarks = await databases.listDocuments(
      databaseId, bookmarkCollectionId, [Query.equal('users', userId)]
    )

    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt')]
    );

    // const bookmarks = await databases.listDocuments(
    //   databaseId, bookmarkCollectionId, [Query.orderDesc('$createdAt')]
    // )


    // const bookmarks = await db.collection('bookmarks').find({ userId: ObjectId(userId) }).toArray();


    // const postIds = bookmarks.map(bookmark => bookmark.postId);
    // const posts = await db.collection('posts').find({ _id: { $in: postIds } }).toArray();
    return userBookmarks
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
  }
};

export const addBookmark = async (userId, videoId) => {
  try {
    const bookmark = await databases.createDocument(
      databaseId,
      bookmarkCollectionId,
      ID.unique(), {
      users: userId,
      videos: videoId,
    });

    return bookmark
  } catch (error) {
    console.error('Error adding bookmark:', error);
  }
};


export const deleteBookmark = async (bookmarkId) => {

  try {
    const bookmark = await databases.deleteDocument(
      databaseId,
      bookmarkCollectionId,
      bookmarkId);

    return bookmark
  } catch (error) {
    console.error('Error deleting bookmark:', error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId, videoCollectionId, [Query.orderDesc('$createdAt')]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      databaseId, videoCollectionId, [Query.orderDesc('$createdAt', Query.limit(7))]
    )
    return posts.documents
  } catch (error) {
    throw new Error(error);
  }
}

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search("title", query)]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc('$createdAt')]
    );

    if (!posts) throw new Error("Something went wrong");

    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session
  } catch (error) {
    throw new Error(error);
  }
}

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export const createVideoPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error);
  }
}