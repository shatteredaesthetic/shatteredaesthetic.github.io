import Typography from 'typography'
import ElkGlen from 'typography-theme-elk-glen'

ElkGlen.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
})

delete ElkGlen.googleFonts

const typography = new Typography(ElkGlen)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
