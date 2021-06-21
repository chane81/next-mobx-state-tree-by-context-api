const withPlugins = require('next-compose-plugins');
const dotenv = require('dotenv');
const isDev = process.env.NODE_ENV === 'development';
const env = dotenv.config({ path: `./env/.env.${isDev ? 'dev' : 'prod'}` }).parsed || {};

const nextConfig = {
  // .env 값 세팅
  env,

  // webpack 5 사용 여부 >> next.js 11 미만 버전에서 아래와 같이 future > webpack5 로 webpack5버전 설정을 할 수 있었으나
  // next.js 11 버전부터는 webpack5 가 기본이다.
  // future: {
  //   webpack5: true,
  // },

  // 웹팩 설정
  webpack: (config, options) => {
    const originalEntry = config.entry;
    config.plugins = config.plugins || [];

    // devtool 설정
    // if (options.dev) {
    //   config.devtool = 'inline-source-map';
    // }

    // webpack 4 일 경우
    // dotenv 에 대한 'Module not found: Can't resolve 'fs' 에러 방지
    // if (!options.isServer) {
    //   config.node = {
    //     fs: 'empty',
    //   };
    // }

    // webpack 5 일 경우
    // webpack 5 부터는 config.node 안씀 -> resolve.fallback 써야함
    if (!options.isServer) {
      // config.resolve.fallback = {
      //   fs: false,
      //   crypto: false,
      //   path: false,
      //   stream: false,
      // };
    }

    // 개발모드인지 여부 true/false
    // console.log('is development mod?:', options.dev);

    // 기본 플러그인 어떤것을 로드하는지 확인
    // config.plugins.map(data => {
    //   console.log('config name:', data.constructor.name);
    // })

    // 옵션정보 확인
    // console.log('options:', options);

    // entry 설정
    config.entry = async () => {
      const entries = await originalEntry();

      return entries;
    };

    return config;
  },
};

module.exports = withPlugins([], nextConfig);
