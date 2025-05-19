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
        mdx: DISPLAY_DEFAULTS.mdx,
        sidebar: DISPLAY_DEFAULTS.sidebar,
        toolbar: [false],
      })
    })

    it('should return the default toolbar when toolbar is omitted', () => {
      expect(normaliseDisplay({ sidebar: false })).toMatchObject({
        mdx: DISPLAY_DEFAULTS.mdx,
        sidebar: [false],
        toolbar: DISPLAY_DEFAULTS.toolbar,
      })
    })

    it('should return arrays when elements are not arrays', () => {
      expect(
        normaliseDisplay({ sidebar: false, toolbar: false }),
      ).toMatchObject({
        mdx: DISPLAY_DEFAULTS.mdx,
        sidebar: [false],
        toolbar: [false],
      })
    })

    it('should return elements when they already are arrays', () => {
      expect(
        normaliseDisplay({ sidebar: [false, true], toolbar: ['story'] }),
      ).toMatchObject({
        mdx: DISPLAY_DEFAULTS.mdx,
        sidebar: [false, true],
        toolbar: ['story'],
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
      'should always return SKIP_INHERITED when config matches the input for the sidebar and skipInherited is true (type %s)',
      ({ type }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: { type, skipInherited: true } } },
            type,
            context: 'sidebar',
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.SKIP_INHERITED)
      },
    )

    it.each(
      ['component', 'docs', 'story', 'group'].map((type) => ({
        type,
      })),
    )(
      'should always return ALWAYS when config matches the input for the sidebar and skipInherited is false (type %s)',
      ({ type }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: { type, skipInherited: false } } },
            type,
            context: 'sidebar',
          } as ShouldDisplayOptions),
        ).toBe(DisplayOutcome.ALWAYS)
      },
    )
  })
})
