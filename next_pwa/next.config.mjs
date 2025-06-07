import withPWA from 'next-pwa';

//handles caching of images, fonts, and api calls with respective timings

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    dest: 'public',
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    register: true,
    runtimeCaching: [ //Caches Google Fonts for 1 day(bad mei 15 days pe test)
        {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'google-fonts',
                expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 // 1 day
                }
            }
        },
        {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|ico|webp)$/,
            handler: 'CacheFirst',
            options: {
                cacheName: 'image-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 * 24 * 15 // 15 days
                }
            }
        },
        {
            urlPattern: /api\//,
            handler: 'NetworkFirst',
            options: {
                cacheName: 'api-cache',
                expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 60 * 60 // 1 hour
                }
            }
        }
    ]
});

export default nextConfig;
