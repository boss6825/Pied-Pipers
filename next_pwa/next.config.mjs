/** @type {import('next').NextConfig} */
const nextConfig = {
    turbopack: {
        rules: {
            
        },
    },
    // Manual PWA configuration without webpack dependency bcz turbopack ke sath conflict ho raha hai
    async headers() {
        return [
            {
                source: '/manifest.json',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/manifest+json',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
