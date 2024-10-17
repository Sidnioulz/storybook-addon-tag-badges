import {
  DISPLAY_DEFAULTS,
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
          sidebar: ['component', 'docs', 'story', 'group'],
          toolbar: [],
        },
      )
    })

    it('should return an empty and a full array when sidebar is false and toolbar true', () => {
      expect(normaliseDisplay({ sidebar: false, toolbar: true })).toMatchObject(
        {
          sidebar: [],
          toolbar: ['component', 'docs', 'story', 'group'],
        },
      )
    })

    it('should return full arrays when both elements are true', () => {
      expect(normaliseDisplay({ sidebar: true, toolbar: true })).toMatchObject({
        sidebar: ['component', 'docs', 'story', 'group'],
        toolbar: ['component', 'docs', 'story', 'group'],
      })
    })

    it('returns only the one matching element when a string is passed', () => {
      expect(
        normaliseDisplay({ sidebar: 'docs', toolbar: 'story' }),
      ).toMatchObject({
        sidebar: ['docs'],
        toolbar: ['story'],
      })
    })

    it('returns an array when passed one to sidebar', () => {
      expect(
        normaliseDisplay({ sidebar: ['docs'], toolbar: false }),
      ).toMatchObject({
        sidebar: ['docs'],
        toolbar: [],
      })
    })

    it('returns an array when passed one to toolbar', () => {
      expect(
        normaliseDisplay({
          sidebar: ['component'],
          toolbar: ['component', 'docs'],
        }),
      ).toMatchObject({
        sidebar: ['component'],
        toolbar: ['component', 'docs'],
      })
    })
  })

  describe('shouldDisplay', () => {
    it('should NOT display stories in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'story',
          context: 'sidebar',
        }),
      ).toBeFalsy()
    })

    it('should display stories in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'story',
          context: 'toolbar',
        }),
      ).toBeTruthy()
    })

    it('should NOT display docs in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'docs',
          context: 'sidebar',
        }),
      ).toBeFalsy()
    })

    it('should display docs in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'docs',
          context: 'toolbar',
        }),
      ).toBeTruthy()
    })

    it('should display component in the sidebar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'component',
          context: 'sidebar',
        }),
      ).toBeTruthy()
    })

    it('should NOT display component in the toolbar by default', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'component',
          context: 'toolbar',
        }),
      ).toBeFalsy()
    })

    it('should return false on root type', () => {
      expect(
        shouldDisplay({
          config: { display: DISPLAY_DEFAULTS },
          type: 'root',
          context: 'toolbar',
        }),
      ).toBeFalsy()
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
        ).toBeFalsy()
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
      'should always return true when config is true (type %s context %s)',
      ({ type, context }) => {
        expect(
          shouldDisplay({
            config: { display: { sidebar: true, toolbar: true } },
            type,
            context,
          } as ShouldDisplayOptions),
        ).toBeTruthy()
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
      'should always return true when config matches the input (type %s context %s)',
      ({ type, context }) => {
        expect(
          shouldDisplay({
            config: { display: { [context]: type } },
            type,
            context,
          } as ShouldDisplayOptions),
        ).toBeTruthy()
      },
    )
  })
})
