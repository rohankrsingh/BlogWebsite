import conf from '../conf/conf.js';
import { Client, Account, ID, OAuthProvider } from "appwrite";
import service from './config.js';

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
            
    }

    async createAccount({email, password, name}) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // call another method
                service.createUserProfile(userAccount.$id, userAccount.name, userAccount.$createdAt, userAccount.email);

                return this.login({email, password});
            } else {
               return  userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }
    async loginGoogle() {
        try {
            const res = await this.account.createOAuth2Session(
                OAuthProvider.Google,
                "http://localhost:5173",
                "http://localhost:5173"
            );
            console.log(res);
        } catch (error) {
            console.error("Error during Google login:", error);
        }
    }
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }

        return null;
    }

    async logout() {

        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
        }
    }

    async updateAccountName(name){
        try{
            return await this.account.updateName(
                name
            )

        }
        catch (error) {
            console.log("Appwrite service :: updateAuthUserName :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService

