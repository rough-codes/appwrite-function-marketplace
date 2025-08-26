import { Client, Account, Databases, Storage, Functions } from 'appwrite';

// Appwrite configuration
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '');

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Database and collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
export const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_STORAGE_BUCKET_ID || '';

// Collection IDs
export const COLLECTIONS = {
  TEMPLATES: 'templates',
  DEPLOYMENTS: 'deployments',
  REVIEWS: 'reviews',
  CATEGORIES: 'categories',
  USER_PROFILES: 'user_profiles'
} as const;

// Function IDs
export const FUNCTIONS_IDS = {
  TEMPLATE_DEPLOYMENT: 'template-deployment',
  TEMPLATE_VALIDATOR: 'template-validator',
  ANALYTICS_COLLECTOR: 'analytics-collector'
} as const;

// Helper functions
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    return null;
  }
};

export const signIn = async (email: string, password: string) => {
  return await account.createEmailSession(email, password);
};

export const signUp = async (email: string, password: string, name: string) => {
  return await account.create('unique()', email, password, name);
};

export const signOut = async () => {
  return await account.deleteSession('current');
};

// Template operations
export const getTemplates = async (queries: string[] = []) => {
  return await databases.listDocuments(DATABASE_ID, COLLECTIONS.TEMPLATES, queries);
};

export const getTemplate = async (templateId: string) => {
  return await databases.getDocument(DATABASE_ID, COLLECTIONS.TEMPLATES, templateId);
};

export const createTemplate = async (data: any) => {
  return await databases.createDocument(DATABASE_ID, COLLECTIONS.TEMPLATES, 'unique()', data);
};

// Deployment operations
export const deployTemplate = async (templateId: string, config: any) => {
  return await functions.createExecution(
    FUNCTIONS_IDS.TEMPLATE_DEPLOYMENT,
    JSON.stringify({ templateId, ...config })
  );
};

export const getDeployments = async (userId: string) => {
  return await databases.listDocuments(DATABASE_ID, COLLECTIONS.DEPLOYMENTS, [
    `user_id=${userId}`
  ]);
};

// Review operations
export const createReview = async (templateId: string, rating: number, comment: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  return await databases.createDocument(DATABASE_ID, COLLECTIONS.REVIEWS, 'unique()', {
    template_id: templateId,
    user_id: user.$id,
    rating,
    comment
  });
};

export const getReviews = async (templateId: string) => {
  return await databases.listDocuments(DATABASE_ID, COLLECTIONS.REVIEWS, [
    `template_id=${templateId}`
  ]);
};

// Storage operations
export const uploadFile = async (file: File) => {
  return await storage.createFile(STORAGE_BUCKET_ID, 'unique()', file);
};

export const getFileUrl = async (fileId: string) => {
  return storage.getFileView(STORAGE_BUCKET_ID, fileId);
};

export default client;