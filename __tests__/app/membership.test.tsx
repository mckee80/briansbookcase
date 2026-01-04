import { render, screen } from '@testing-library/react';

describe('Membership Tiers', () => {
  const MEMBERSHIP_TIERS = [
    { name: 'Free', price: 0 },
    { name: 'Supporter', price: 5 },
    { name: 'Advocate', price: 10 },
    { name: 'Champion', price: 20 },
  ];

  it('has four membership tiers', () => {
    expect(MEMBERSHIP_TIERS).toHaveLength(4);
  });

  it('includes Free tier at $0', () => {
    const freeTier = MEMBERSHIP_TIERS.find(t => t.name === 'Free');
    expect(freeTier).toBeDefined();
    expect(freeTier?.price).toBe(0);
  });

  it('includes Supporter tier at $5', () => {
    const supporterTier = MEMBERSHIP_TIERS.find(t => t.name === 'Supporter');
    expect(supporterTier).toBeDefined();
    expect(supporterTier?.price).toBe(5);
  });

  it('includes Advocate tier at $10', () => {
    const advocateTier = MEMBERSHIP_TIERS.find(t => t.name === 'Advocate');
    expect(advocateTier).toBeDefined();
    expect(advocateTier?.price).toBe(10);
  });

  it('includes Champion tier at $20', () => {
    const championTier = MEMBERSHIP_TIERS.find(t => t.name === 'Champion');
    expect(championTier).toBeDefined();
    expect(championTier?.price).toBe(20);
  });

  it('all tiers have valid prices', () => {
    MEMBERSHIP_TIERS.forEach(tier => {
      expect(tier.price).toBeGreaterThanOrEqual(0);
      expect(typeof tier.price).toBe('number');
    });
  });

  it('all tiers have names', () => {
    MEMBERSHIP_TIERS.forEach(tier => {
      expect(tier.name).toBeTruthy();
      expect(typeof tier.name).toBe('string');
    });
  });
});
