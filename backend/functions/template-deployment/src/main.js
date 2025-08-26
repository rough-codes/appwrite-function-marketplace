import { Client, Functions, Databases, Storage } from 'node-appwrite';

/**
 * Appwrite Function: Template Deployment Engine
 * Handles one-click deployment of function templates to user's Appwrite project
 */

export default async ({ req, res, log, error }) => {
  try {
    const { templateId, userProjectId, userApiKey, customName, envVars } = JSON.parse(req.body);

    // Initialize Appwrite clients
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const userClient = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(userProjectId)
      .setKey(userApiKey);

    const databases = new Databases(client);
    const storage = new Storage(client);
    const userFunctions = new Functions(userClient);

    // 1. Fetch template details
    const template = await databases.getDocument(
      process.env.DATABASE_ID,
      'templates',
      templateId
    );

    log(`Deploying template: ${template.title}`);

    // 2. Download template source code
    const sourceFile = await storage.getFileDownload(
      process.env.STORAGE_BUCKET_ID,
      template.source_code_url
    );

    // 3. Create function in user's project
    const functionData = {
      functionId: `marketplace-${templateId}-${Date.now()}`,
      name: customName || template.title,
      runtime: template.runtime,
      execute: ['any'],
      events: [],
      schedule: '',
      timeout: 15,
      enabled: true
    };

    const newFunction = await userFunctions.create(
      functionData.functionId,
      functionData.name,
      functionData.runtime,
      functionData.execute,
      functionData.events,
      functionData.schedule,
      functionData.timeout,
      functionData.enabled
    );

    // 4. Set environment variables
    if (envVars && Object.keys(envVars).length > 0) {
      for (const [key, value] of Object.entries(envVars)) {
        await userFunctions.createVariable(
          newFunction.$id,
          key,
          value
        );
      }
    }

    // 5. Deploy the code
    const deployment = await userFunctions.createDeployment(
      newFunction.$id,
      sourceFile,
      true, // activate
      template.runtime.includes('node') ? 'package.json' : undefined
    );

    // 6. Record deployment in database
    await databases.createDocument(
      process.env.DATABASE_ID,
      'deployments',
      'unique()',
      {
        template_id: templateId,
        user_id: req.headers['x-appwrite-user-id'] || 'anonymous',
        appwrite_function_id: newFunction.$id,
        deployment_status: 'deploying',
        deployment_logs: JSON.stringify({
          deployment_id: deployment.$id,
          created_at: new Date().toISOString()
        })
      }
    );

    // 7. Update template download count
    await databases.updateDocument(
      process.env.DATABASE_ID,
      'templates',
      templateId,
      {
        download_count: template.download_count + 1
      }
    );

    log(`Successfully deployed function: ${newFunction.$id}`);

    return res.json({
      success: true,
      function: {
        id: newFunction.$id,
        name: newFunction.name,
        deployment_id: deployment.$id
      },
      message: 'Template deployed successfully!'
    });

  } catch (err) {
    error(`Deployment failed: ${err.message}`);
    
    return res.json({
      success: false,
      error: err.message
    }, 400);
  }
};