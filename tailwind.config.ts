import type { Config } from 'tailwindcss';

export default {
  // No 'content' array needed in v4 – all classes are always generated
  theme: {
    extend: {
      // Add custom themes here if needed, e.g.,
      // colors: {
      //   primary: '#3b82f6',
      // },
    },
  },
  plugins: [],
} satisfies Config;