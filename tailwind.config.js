// tailwind.config.js

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // ... (다른 설정 생략)
  theme: {
    extend: {
      fontFamily: {
        // 'nanum-square'라는 이름으로 폰트를 정의하고, 산세리프 폰트를 fallback으로 사용합니다.
        'nanum-square': ['"Nanum Square Neo"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // ...
}