import {
  getTagParts,
  getTagPrefix,
  getTagSuffix,
  matchTag,
  matchTags,
} from '../tag'

describe('tag', () => {
  describe('getTagParts', () => {
    it('should return only a prefix on a single-part tag', () => {
      expect(getTagParts('foo')).toMatchObject({
        prefix: 'foo',
        suffix: null,
      })
    })

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
  })

  describe('getTagPrefix', () => {
    it('should return only a prefix on a single-part tag', () => {
      expect(getTagPrefix('foo')).toBe('foo')
    })

    it('should return prefix on a two-part tag', () => {
      expect(getTagPrefix('foo:bar')).toBe('foo')
    })

    it('should return prefix on a many-part tag', () => {
      expect(getTagPrefix('foo:bar:ter')).toBe('foo')
    })
  })

  describe('getTagSuffix', () => {
    it('should return null on a single-part tag', () => {
      expect(getTagSuffix('foo')).toBe(null)
    })

    it('should return suffix on a two-part tag', () => {
      expect(getTagSuffix('foo:bar')).toBe('bar')
    })

    it('should return suffix on a many-part tag', () => {
      expect(getTagSuffix('foo:bar:ter')).toBe('bar:ter')
    })
  })

  describe('matchTag', () => {
    it('string - matches when the tag is identical', () => {
      expect(matchTag('foo', 'foo')).toBe(true)
    })

    it('string - fails when the tag is different', () => {
      expect(matchTag('foo', 'bar')).toBe(false)
    })

    it('string array - matches when the tag is included', () => {
      expect(matchTag('foo', ['foo'])).toBe(true)
    })

    it('string array - does not partial match', () => {
      expect(matchTag('weasel', ['ease'])).toBe(false)
      expect(matchTag('weasel', ['easel'])).toBe(false)
      expect(matchTag('weasel', ['we'])).toBe(false)
    })

    it('string array - fails when the tag is not included', () => {
      expect(matchTag('foo', ['bar'])).toBe(false)
    })

    it('regex - matches when the tag is included', () => {
      expect(matchTag('foo', /^fo+/)).toBe(true)
    })

    it('regex - fails when the tag is not included', () => {
      expect(matchTag('foo', /^ba?r$/)).toBe(false)
    })

    it('regex array - matches when the tag is included', () => {
      expect(matchTag('foo', [/^fo+/])).toBe(true)
    })

    it('regex array - fails when the tag is not included', () => {
      expect(matchTag('foo', [/^ba?r$/])).toBe(false)
    })

    it('object - matches string prefix only', () => {
      expect(matchTag('foo:x', { prefix: 'foo' })).toBe(true)
    })

    it('object - matches string suffix only', () => {
      expect(matchTag('x:foo', { suffix: 'foo' })).toBe(true)
    })

    it('object - matches both string prefix and suffix', () => {
      expect(matchTag('foo:bar', { prefix: 'foo', suffix: 'bar' })).toBe(true)
    })

    it('object - matches regex prefix only', () => {
      expect(matchTag('foo:bar', { prefix: /fo+/ })).toBe(true)
    })

    it('object - matches regex suffix only', () => {
      expect(matchTag('foo:bar', { suffix: /ba+/ })).toBe(true)
    })

    it('object - matches both regex prefix and suffix', () => {
      expect(matchTag('foo:bar', { prefix: /fo+/, suffix: /bar+/ })).toBe(true)
    })

    it('object - matches regex prefix with a starting character', () => {
      expect(matchTag('foo:bar', { prefix: /^fo+/ })).toBe(true)
    })

    it('object - matches regex suffix with a starting character', () => {
      expect(matchTag('foo:bar', { suffix: /^ba+r?/ })).toBe(true)
    })

    it('object - matches both regex prefix and suffix with a starting character', () => {
      expect(matchTag('foo:bar', { prefix: /^fo+/, suffix: /^ba+r?/ })).toBe(
        true,
      )
    })

    it('object - matches regex prefix with an ending character', () => {
      expect(matchTag('foo:bar', { prefix: /fo+$/ })).toBe(true)
    })

    it('object - matches regex suffix with an ending character', () => {
      expect(matchTag('foo:bar', { suffix: /ba+r?$/ })).toBe(true)
    })

    it('object - matches both regex prefix and suffix with an ending character', () => {
      expect(matchTag('foo:bar', { prefix: /fo+$/, suffix: /ba+r?$/ })).toBe(
        true,
      )
    })

    it('object - fails to match a suffixless tag when a suffix regex is passed', () => {
      expect(matchTag('foo', { suffix: /ba+r?$/ })).toBe(false)
    })

    it('object - fails to match prefix if the string is not multipart', () => {
      expect(matchTag('foo', { prefix: 'foo' })).toBe(false)
    })

    it('object - fails to match suffix if the string is not multipart', () => {
      expect(matchTag('foo', { suffix: 'foo' })).toBe(false)
    })

    it('object - fails non-matching string prefix', () => {
      expect(matchTag('foo:bar', { prefix: 'boo' })).toBe(false)
    })

    it('object - fails non-matching string suffix', () => {
      expect(matchTag('foo:bar', { suffix: 'baa' })).toBe(false)
    })

    it('object - fails non-matching string prefix and suffix', () => {
      expect(matchTag('foo:bar', { prefix: 'boo', suffix: 'baa' })).toBe(false)
    })

    it('object - fails non-matching regex prefix', () => {
      expect(matchTag('foo:bar', { prefix: /bo+/ })).toBe(false)
    })

    it('object - fails non-matching regex suffix', () => {
      expect(matchTag('foo:bar', { suffix: /ba+$/ })).toBe(false)
    })

    it('object - fails non-matching regex prefix and suffix', () => {
      expect(matchTag('foo:bar', { prefix: /bo+/, suffix: /ba+$/ })).toBe(false)
    })

    it('object - fails a partial match where only prefix is correct', () => {
      expect(matchTag('foo:bar', { prefix: 'foo', suffix: 'wrong' })).toBe(
        false,
      )
    })

    it('object - fails a partial match where only suffix is correct', () => {
      expect(matchTag('foo:bar', { prefix: 'wrong', suffix: 'bar' })).toBe(
        false,
      )
    })
  })

  describe('matchTags', () => {
    it('should return an empty array when receiving an empty array', () => {
      const input: string[] = []
      const output = matchTags(input, /.*/)
      expect(output).toHaveLength(0)
    })
    it('should return an empty array when nothing matches', () => {
      const input = ['version:1.0.0', 'foo', 'bar', 'version:2.0.0']
      const output = matchTags(input, { suffix: 'weasels' })
      expect(output).toHaveLength(0)
    })

    it('should return a partial match when not every tag matches', () => {
      const input = ['version:1.0.0', 'foo', 'bar', 'version:2.0.0']
      const output = matchTags(input, { prefix: 'version' })
      expect(output).toHaveLength(2)
      expect(output).toContain('version:1.0.0')
      expect(output).toContain('version:2.0.0')
    })

    it('should return a full match when every tag matches', () => {
      const input = ['version:1.0.0', 'version:2.0.0']
      const output = matchTags(input, { prefix: 'version' })
      expect(input).toEqual(output)
    })
  })
})
