import { getTagParts } from 'src/utils/tag'

describe('tag', () => {
  describe('getTagParts', () => {
    it('should return prefix and suffix on a two-part tag', () => {
      expect(getTagParts('foo:bar')).toMatchObject({
        prefix: 'foo',
        suffix: 'bar',
      })
    })
    it('should return all parts beyond the prefix in the suffix', () => {
      expect(getTagParts('foo:bar:ter')).toMatchObject({
        prefix: 'foo',
        suffix: 'bar:ter',
      })
    })
    it('should return only a prefix on a single-part tag', () => {
      expect(getTagParts('foo')).toMatchObject({
        prefix: 'foo',
        suffix: undefined,
      })
    })
  })
})
