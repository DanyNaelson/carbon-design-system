import { describe, it, expect } from 'vitest';
import {
  checkCompatibility,
  getContractVersion,
  createVersionHeader,
} from './versioning';

describe('checkCompatibility', () => {
  it('returns compatible for same version', () => {
    const result = checkCompatibility('1.0');
    expect(result.compatible).toBe(true);
    expect(result.message).toContain('fully compatible');
  });

  it('returns compatible for same major, higher minor', () => {
    const result = checkCompatibility('1.5');
    expect(result.compatible).toBe(true);
    expect(result.message).toContain('newer minor version');
  });

  it('returns compatible for same major, lower minor', () => {
    const result = checkCompatibility('1.0');
    expect(result.compatible).toBe(true);
  });

  it('returns incompatible for different major version', () => {
    const result = checkCompatibility('2.0');
    expect(result.compatible).toBe(false);
    expect(result.message).toContain('Incompatible');
    expect(result.message).toContain('migration');
  });

  it('returns incompatible for major version 0', () => {
    const result = checkCompatibility('0.9');
    expect(result.compatible).toBe(false);
  });

  it('includes both versions in result', () => {
    const result = checkCompatibility('1.3');
    expect(result.clientVersion).toBe('1.0');
    expect(result.serverVersion).toBe('1.3');
  });
});

describe('getContractVersion', () => {
  it('returns the current contract version', () => {
    expect(getContractVersion()).toBe('1.0');
  });
});

describe('createVersionHeader', () => {
  it('creates a version header object', () => {
    const header = createVersionHeader();
    expect(header).toEqual({ version: '1.0' });
  });
});
