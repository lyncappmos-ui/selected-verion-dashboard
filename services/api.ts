
/**
 * DEPRECATED: Consolidating logic into services/coreClient.ts
 * This file is kept temporarily for migration support but all pages should 
 * transition to coreClient.fetchCore.
 */
import { coreClient } from './coreClient';
export const mosApi = coreClient;
