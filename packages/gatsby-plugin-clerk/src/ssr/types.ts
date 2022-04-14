import { Session, User } from '@clerk/backend-core/src';
import type { GetServerDataProps } from "gatsby"
import { ServerGetToken } from '@clerk/types';

export type GetServerDataPropsWithAuth = GetServerDataProps & {
  auth?: {
    session: Session | undefined | null;
    userId: string | null;
    sessionId: string | null;
    getToken: ServerGetToken
  };
  user?: User | undefined | null;
}
