const createErrorMessage = (msg: string) => {
  return `🔒 Clerk: ${msg.trim()}

For more info, check out the docs: https://docs.clerk.dev,
or come say hi in our discord server: https://rebrand.ly/clerk-discord

`;
};

export const noFrontendApiError = createErrorMessage(`
The CLERK_FRONTEND_API environment variable must be set before using Clerk.
During development, grab the Frontend Api value from the Clerk Dashboard, create an .env file and set the CLERK_FRONTEND_API key.
For production apps, please consult the Remix documentation on environment variables.
`);
