import conf from '../conf/conf.js';
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
    client = new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId, tags }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId,
                    tags,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updatePost(slug, { title, content, featuredImage, status, tags }) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    tags,

                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug

            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug

            )
        } catch (error) {
            console.log("Appwrite serive :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active"), ], additionalQueries = []) {
        try {
            const combinedQueries = [...queries, ...additionalQueries];
    
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                combinedQueries
            );
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false;
        }
    }

    // file upload service

    async uploadFile(file) {
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }
    }

    getFilePreview(fileId) {
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId,

        )
    }
    // User Profile Services
    async createUserProfile(userId, name, createdAt, email, description, location, avatar) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                "user",
                userId,
                {
                    userId,
                    name,
                    createdAt,
                    email,
                    description,
                    location,
                    avatar
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updateAuthUserName(userId, name){
        try{
            return await this.users.updateName(
                userId,
                name
            )

        }
        catch (error) {
            console.log("Appwrite service :: updateAuthUserName :: error", error);
        }
    }
    async updateUserProfile(userId, name, email, description, location, liked, avatar) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                "user",
                userId,
                {
                    name,
                    email,
                    description,
                    location,
                    liked,
                    avatar
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }
    async getUserProfile(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                "user",
                userId
            )
        } catch (error) {
            console.log("Appwrite service :: getUserProfile :: error", error);
        }
    }
    async getPostsByUser(userId) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                {
                    collection: "post",
                    filter: {
                        userId
                    }
                }
            )
        } catch (error) {
            console.log("Appwrite service :: getPostsByUser :: error", error);
        }
    }

    // Like feature

    async updatePostLikes(slug, likes, likesCount) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    likes,
                    likesCount,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePostLikes :: error", error);
        }
    }

    async getLikedPost(userId) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                "user",
                userId,
                
            )
        } catch (error) {
            console.log("Appwrite service :: getLikedPost :: error", error);
        }

    }
    async updateLikedPost(userId, liked) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                "user",
                userId,
                {
                    liked: liked,
                }
            )
        } catch (error) {
            console.log("Appwrite service :: updatePostLikesUser :: error", error);
        }
    }



}

const service = new Service()
export default service;