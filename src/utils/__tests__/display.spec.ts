import {
  DISPLAY_DEFAULTS,
  DisplayOutcome,
  normaliseDisplay,
  shouldDisplay,
  type ShouldDisplayOptions,
} from '../display'

describe('display', () => {
  describe('normaliseDisplay', () => {
    it('should return defaults when display is not set', () => {
      expect(normaliseDisplay(undefined)).toMatchObject(DISPLAY_DEFAULTS)
    })

    it('should return the default sidebar when sidebar is omitted', () => {
      expect(normaliseDisplay({ toolbar: false })).toMatchObject({
        sidebar: DISPLAY_DEFAULTS.sidebar,
        toolbar: [],
      })
    })

    it('should return the default toolbar when toolbar is omitted', () => {
      expect(normaliseDisplay({ sidebar: false })).toMatchObject({
        sidebar: [],
        toolbar: DISPLAY_DEFAULTS.toolbar,
      })
    })

    it('should return empty arrays when both elements are false', () => {
      expect(
        normaliseDisplay({ sidebar: false, toolbar: false }),
      ).toMatchObject({
        sidebar: [],
        toolbar: [],
      })
    })

    it('should return an empty and a full array when sidebar is true and toolbar false', () => {
      expect(normaliseDisplay({ sidebar: true, toolbar: false })).toMatchObject(
        {
          sidebar: [{ skipInherited: false }],
          toolbar: [],
        },
      )
    })

    it('should return an empty and a full array when sidebar is false and toolbar true', () => {
      expect(normaliseDisplay({ sidebar: false, toolbar: true })).toMatchObject(
        {
          sidebar: [],
          toolbar: [{ skipInherited: false }],
        },
      )
    })

    it('should return full arrays when both elements are true', () => {
      expect(normaliseDisplay({ sidebar: true, toolbar: true })).toMatchObject({
        sidebar: [{ skipInherited: false }],
        toolbar: [{ skipInherited: false }],
      })
    })

    it('returns only the one matching element when a string is passed', () => {
      expect(
        normaliseDisplay({ sidebar: 'docs', toolbar: 'story' }),
      ).toMatchObject({
        sidebar: [{ type: 'docs' }],
        toolbar: [{ type: 'story' }],
      })
    })

    it('returns an array when passed one to sidebar', () => {
      expect(
        normaliseDisplay({ sidebar: ['docs'], toolbar: false }),
      ).toMatchObject({
        sidebar: [{ type: 'docs' }],
        toolbar: [],
      })
    })

    it('returns an array when passed one to toolbar', () => {
      expect(
        normaliseDisplay({
          sidebar: ['component'],
          toolbar: ['docs'],
        }),
      ).toMatchObject({
        sidebar: [{ type: 'component' }],
        toolbar: [{ type: 'docs' }],
      })
    })
  })

  describe('shouldDisplay', () => {
    it('should only display non-inherited tags for stories in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: {
            display: DISPLAY_DEFAULTS,
          },
          type: 'story',
          context: 'sidebar',
        }),
      ).toBe(DisplayOutcome.SKIP_INHERITED)
    })

    it('should display stories in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'story',
          context: 'toolbar',
        }),
      ).toBe(DisplayOutcome.ALWAYS)
    })

    it('should only display non-inherited tags for docs in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'docs',
          context: 'sidebar',
        }),
      ).toBe(DisplayOutcome.SKIP_INHERITED)
    })

    it('should display docs in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'docs',
          context: 'toolbar',
        }),
      ).toBe(DisplayOutcome.ALWAYS)
    })

    it('should display component in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'component',
          context: 'sidebar',
        }),
      ).toBe(DisplayOutcome.ALWAYS)
    })

    it('should NOT display component in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'component',
          context: 'toolbar',
        }),
      ).toBe(DisplayOutcome.NEVER)
    })

    it('should NOT display component in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'group',
          context: 'sidebar',
        }),
      ).toBe(DisplayOutcome.ALWAYS)
    })

    it('should display group in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'group',
          context: 'toolbar',
        }),
      ).toBe(DisplayOutcome.NEVER)
    })

    it('should return false on root type', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'root',
          context: 'toolbar',
        }),
      ).toBe(DisplayOutcome.NEVER)
    })

    it.each(
      ['sidebar', 'toolbar'].flatMap((context) =>
        ['component', 'docs', 'story', 'group'].map((type) => ({
          context,
          type,
        })),
      ),
    )(
      'should always return false when config is false (type %s context %s)',
      ({ type, context }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: false, toolbar: false } },
            type,
            context,
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.NEVER)
      },
    )

    it.each(
      ['sidebar', 'toolbar'].flatMap((context) =>
        ['component', 'docs', 'story', 'group'].map((type) => ({
          context,
          type,
        })),
      ),
    )(
      'should always return ALWAYS when config is true (type %s context %s)',
      ({ type, context }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: true, toolbar: true } },
            type,
            context,
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.ALWAYS)
      },
    )

    it.each(
      ['component', 'docs', 'story', 'group'].map((type) => ({
        type,
      })),
    )(
      'should always return ALWAYS when config matches the input for the toolbar (type %s)',
      ({ type }) => {
        expect(
          shouldDisplay({
            config: { display: { toolbar: type } },
            type,
            context: 'toolbar',
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.ALWAYS)
      },
    )

    it.each(
      ['component', 'docs', 'story', 'group'].map((type) => ({
        type,
      })),
    )(
      'should always return SKIP_INHERITED when config matches the input for the sidebar (type %s)',
      ({ type }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: type } },
            type,
            context: 'sidebar',
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.SKIP_INHERITED)
      },
    )
  })
})
