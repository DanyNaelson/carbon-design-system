import { CONTRACT_VERSION } from '../types';

/**
 * Contract versioning system.
 *
 * Ensures the frontend and MCP backend are speaking the same language.
 * If the backend sends a message with an incompatible version,
 * we can gracefully handle it or reject it.
 */

export interface VersionCheck {
  compatible: boolean;
  clientVersion: string;
  serverVersion: string;
  message: string;
}

/**
 * Parse a version string into major and minor numbers.
 */
function parseVersion(version: string): { major: number; minor: number } {
  const [major, minor] = version.split('.').map(Number);
  return { major: major ?? 0, minor: minor ?? 0 };
}

/**
 * Check if a server message version is compatible with the client.
 *
 * Compatibility rules:
 * - Same major version → compatible (minor differences are backwards-compatible)
 * - Different major version → incompatible (breaking changes)
 *
 * @example
 * ```ts
 * const check = checkCompatibility('1.2');
 * if (!check.compatible) {
 *   console.warn(check.message);
 * }
 * ```
 */
export function checkCompatibility(serverVersion: string): VersionCheck {
  const client = parseVersion(CONTRACT_VERSION);
  const server = parseVersion(serverVersion);

  if (client.major !== server.major) {
    return {
      compatible: false,
      clientVersion: CONTRACT_VERSION,
      serverVersion,
      message: `Incompatible contract versions: client=${CONTRACT_VERSION}, server=${serverVersion}. Major version mismatch — a migration is required.`,
    };
  }

  if (server.minor > client.minor) {
    return {
      compatible: true,
      clientVersion: CONTRACT_VERSION,
      serverVersion,
      message: `Server has newer minor version (${serverVersion} > ${CONTRACT_VERSION}). Some new features may not be supported by this client.`,
    };
  }

  return {
    compatible: true,
    clientVersion: CONTRACT_VERSION,
    serverVersion,
    message: 'Versions are fully compatible.',
  };
}

/**
 * Get the current contract version.
 */
export function getContractVersion(): string {
  return CONTRACT_VERSION;
}

/**
 * Create a version header for outgoing MCP responses.
 */
export function createVersionHeader(): { version: string } {
  return { version: CONTRACT_VERSION };
}
